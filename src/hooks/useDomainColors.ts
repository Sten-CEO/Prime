import { useState, useEffect } from 'react';

// Domaines disponibles dans l'application (basés sur les pages /domaines/[slug])
const AVAILABLE_DOMAINS = ['business', 'sport', 'social', 'sante'] as const;

export interface DomainColor {
  domain: string;
  color: string;
  label: string;
}

const DEFAULT_COLORS: Record<string, string> = {
  business: '210 100% 60%',
  sport: '142 90% 55%',
  social: '330 100% 70%',
  sante: '0 100% 65%',
  general: '0 0% 100%', // Blanc pour le domaine Général
};

const DOMAIN_LABELS: Record<string, string> = {
  business: 'Business',
  sport: 'Sport',
  social: 'Social',
  sante: 'Santé',
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
    return AVAILABLE_DOMAINS.map(domain => ({
      domain,
      color: getDomainColor(domain),
      label: getDomainLabel(domain),
    }));
  };

  const resetToDefaults = () => {
    const resetColors: Record<string, string> = {};
    AVAILABLE_DOMAINS.forEach(domain => {
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
