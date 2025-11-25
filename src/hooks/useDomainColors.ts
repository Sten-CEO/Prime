import { useState, useEffect } from 'react';

export type DomainKey = 'business' | 'sport' | 'developpement' | 'sante' | 'relations' | 'finance' | 'general';

export interface DomainColor {
  domain: DomainKey;
  color: string;
  label: string;
}

const DEFAULT_COLORS: Record<DomainKey, string> = {
  business: '210 100% 60%',
  sport: '142 90% 55%',
  developpement: '271 100% 72%',
  sante: '0 100% 65%',
  relations: '330 100% 70%',
  finance: '25 100% 60%',
  general: '195 100% 60%',
};

const DOMAIN_LABELS: Record<DomainKey, string> = {
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
  const [domainColors, setDomainColors] = useState<Record<DomainKey, string>>(() => {
    const stored = localStorage.getItem('prime_domain_colors');
    return stored ? JSON.parse(stored) : DEFAULT_COLORS;
  });

  useEffect(() => {
    localStorage.setItem('prime_domain_colors', JSON.stringify(domainColors));
  }, [domainColors]);

  const setDomainColor = (domain: DomainKey, color: string) => {
    setDomainColors(prev => ({
      ...prev,
      [domain]: color,
    }));
  };

  const getDomainColor = (domain: DomainKey): string => {
    return domainColors[domain] || DEFAULT_COLORS[domain];
  };

  const getDomainLabel = (domain: DomainKey): string => {
    return DOMAIN_LABELS[domain];
  };

  const getAllDomains = (): DomainColor[] => {
    return Object.keys(DEFAULT_COLORS).map(key => ({
      domain: key as DomainKey,
      color: getDomainColor(key as DomainKey),
      label: getDomainLabel(key as DomainKey),
    }));
  };

  const resetToDefaults = () => {
    setDomainColors(DEFAULT_COLORS);
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
