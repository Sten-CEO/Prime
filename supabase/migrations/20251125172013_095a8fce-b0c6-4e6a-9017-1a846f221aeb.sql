-- Fonction pour créer les domaines par défaut pour un utilisateur
CREATE OR REPLACE FUNCTION public.create_default_domains(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insérer les 4 domaines par défaut s'ils n'existent pas déjà
  INSERT INTO public.domains (user_id, name, slug, icon, color)
  VALUES 
    (user_id_param, 'Business', 'business', 'briefcase', '210 100% 60%'),
    (user_id_param, 'Sport', 'sport', 'dumbbell', '142 90% 55%'),
    (user_id_param, 'Social', 'social', 'users', '330 100% 70%'),
    (user_id_param, 'Santé', 'sante', 'heart', '0 100% 65%')
  ON CONFLICT DO NOTHING;
END;
$$;

-- Créer les domaines par défaut pour tous les utilisateurs existants
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT DISTINCT user_id FROM public.domains
  LOOP
    PERFORM public.create_default_domains(user_record.user_id);
  END LOOP;
END;
$$;