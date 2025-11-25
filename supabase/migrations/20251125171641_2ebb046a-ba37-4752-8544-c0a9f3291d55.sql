-- Ajouter les colonnes icon et color à la table domains
ALTER TABLE public.domains 
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS color TEXT;

-- Ajouter un commentaire pour la documentation
COMMENT ON COLUMN public.domains.icon IS 'Nom de l''icône Lucide à utiliser pour ce domaine';
COMMENT ON COLUMN public.domains.color IS 'Couleur HSL du domaine (format: "210 100% 60%")';