import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DomainMetric {
  id: string;
  name: string;
  icon: string | null;
  domain_id: string;
  category_id: string | null;
  is_active: boolean;
  default_impact_simple: number;
  default_impact_advanced: number;
  default_impact_exceptional: number;
  created_at: string;
  updated_at: string;
}

/**
 * Hook pour récupérer les métriques d'un domaine spécifique
 */
export const useDomainMetrics = (domainId: string | null) => {
  return useQuery({
    queryKey: ["domainMetrics", domainId],
    queryFn: async (): Promise<DomainMetric[]> => {
      if (!domainId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .eq("domain_id", domainId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!domainId,
  });
};
