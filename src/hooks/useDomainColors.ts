import { useState, useEffect } from 'react';

export interface DomainColor {
  domain: string;
  color: string;
  label: string;
}

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

const DEFAULT_COLORS: Record<string, string> = {
  business: '210 100% 60%',
  sport: '142 90% 55%',
  social: '330 100% 70%',
  sante: '0 100% 65%',
};

export const useDomainColors = () => {
  const [domainColors, setDomainColors] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('prime_domain_colors');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('prime_domain_colors', JSON.stringify(domainColors));
  }, [domainColors]);

  const setDomainColor = (domainSlug: string, color: string) => {
    setDomainColors(prev => ({
      ...prev,
      [domainSlug]: color,
    }));
  };

  const getDomainColor = (domainSlug: string): string => {
    return domainColors[domainSlug] || DEFAULT_COLORS[domainSlug] || '210 100% 60%';
  };

  const resetToDefaults = () => {
    setDomainColors({});
  };

  return {
    domainColors,
    setDomainColor,
    getDomainColor,
    resetToDefaults,
  };
};
