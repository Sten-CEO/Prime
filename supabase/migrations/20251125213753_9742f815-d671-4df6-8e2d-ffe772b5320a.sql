-- Adapter la table metrics pour supporter les nouveaux champs
ALTER TABLE public.metrics 
ADD COLUMN IF NOT EXISTS scheduled_days text[] DEFAULT ARRAY['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'],
ADD COLUMN IF NOT EXISTS impact_weight numeric DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'medium' CHECK (difficulty_level IN ('low', 'medium', 'high'));

-- Commentaires pour documenter
COMMENT ON COLUMN public.metrics.scheduled_days IS 'Jours de la semaine où la métrique est programmée';
COMMENT ON COLUMN public.metrics.impact_weight IS 'Poids d''impact de base de la métrique';
COMMENT ON COLUMN public.metrics.difficulty_level IS 'Niveau de difficulté: low, medium, high';

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_metrics_domain_category ON public.metrics(domain_id, category_id);
CREATE INDEX IF NOT EXISTS idx_metric_records_date ON public.metric_records(recorded_date);
CREATE INDEX IF NOT EXISTS idx_free_performance_records_date ON public.free_performance_records(recorded_date);