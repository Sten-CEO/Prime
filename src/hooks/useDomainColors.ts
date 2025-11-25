import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DomainColor {
  domain: string;
  color: string;
  label: string;
}

const DEFAULT_COLORS: Record<string, string> = {
  business: '210 100% 60%',
  sport: '142 90% 55%',
  developpement: '271 100% 72%',
  sante: '0 100% 65%',
  relations: '330 100% 70%',
  finance: '25 100% 60%',
  general: '195 100% 60%',
};

const DOMAIN_LABELS: Record<string, string> = {
  business: 'Business',
  sport: 'Sport',
  developpement: 'Développement',
  sante: 'Santé',
  relations: 'Relations',
  finance: 'Finance',
  general: 'Général',
};

export const COLOR_PALETTE = [
  { name: 'Bleu', value: '210 100% 60%' },
  { name: 'Vert', value: '142 90% 55%' },
  { name: 'Violet', value: '271 100% 72%' },
  { name: 'Rose', value: '330 100% 70%' },
  { name: 'Orange', value: '25 100% 60%' },
  { name: 'Cyan', value: '180 100% 60%' },
  { name: 'Rouge', value: '0 100% 65%' },
  { name: 'Jaune', value: '45 100% 60%' },
  { name: 'Indigo', value: '240 100% 70%' },
  { name: 'Turquoise', value: '165 100% 60%' },
  { name: 'Magenta', value: '300 100% 70%' },
  { name: 'Lime', value: '80 90% 55%' },
];

export const useDomainColors = () => {
  const [domainColors, setDomainColors] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('prime_domain_colors');
    return stored ? JSON.parse(stored) : {};
  });

  const [activeDomains, setActiveDomains] = useState<string[]>([]);

  useEffect(() => {
    const fetchActiveDomains = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: journalDomains } = await supabase
        .from('journal_entries')
        .select('domain_id')
        .eq('user_id', user.id);

      const { data: insightDomains } = await supabase
        .from('insights')
        .select('domain_id')
        .eq('user_id', user.id);

      const domains = new Set<string>();
      journalDomains?.forEach(entry => domains.add(entry.domain_id));
      insightDomains?.forEach(insight => domains.add(insight.domain_id));

      setActiveDomains(Array.from(domains));
    };

    fetchActiveDomains();
  }, []);

  useEffect(() => {
    localStorage.setItem('prime_domain_colors', JSON.stringify(domainColors));
  }, [domainColors]);

  const setDomainColor = (domain: string, color: string) => {
    setDomainColors(prev => ({
      ...prev,
      [domain]: color,
    }));
  };

  const getDomainColor = (domain: string): string => {
    return domainColors[domain] || DEFAULT_COLORS[domain] || '210 100% 60%';
  };

  const getDomainLabel = (domain: string): string => {
    return DOMAIN_LABELS[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
  };

  const getAllDomains = (): DomainColor[] => {
    return activeDomains.map(domain => ({
      domain,
      color: getDomainColor(domain),
      label: getDomainLabel(domain),
    }));
  };

  const resetToDefaults = () => {
    const resetColors: Record<string, string> = {};
    activeDomains.forEach(domain => {
      resetColors[domain] = DEFAULT_COLORS[domain] || '210 100% 60%';
    });
    setDomainColors(resetColors);
  };

  return {
    domainColors,
    setDomainColor,
    getDomainColor,
    getDomainLabel,
    getAllDomains,
    resetToDefaults,
  };
};
