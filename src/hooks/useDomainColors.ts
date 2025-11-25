import { useState, useEffect } from 'react';
import { useDomains } from './useDomains';

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

export const useDomainColors = () => {
  const { domains } = useDomains();
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
    // Check custom colors first
    if (domainColors[domainSlug]) {
      return domainColors[domainSlug];
    }
    
    // Check if domain has a color set in database
    const domain = domains.find(d => d.slug === domainSlug);
    if (domain?.color) {
      return domain.color;
    }

    // Fallback to default blue
    return '210 100% 60%';
  };

  const getDomainLabel = (domainSlug: string): string => {
    const domain = domains.find(d => d.slug === domainSlug);
    return domain?.name || domainSlug.charAt(0).toUpperCase() + domainSlug.slice(1);
  };

  const getAllDomains = (): DomainColor[] => {
    return domains.map(domain => ({
      domain: domain.slug,
      color: getDomainColor(domain.slug),
      label: domain.name,
    }));
  };

  const resetToDefaults = () => {
    const resetColors: Record<string, string> = {};
    domains.forEach(domain => {
      if (domain.color) {
        resetColors[domain.slug] = domain.color;
      }
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
