import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook pour convertir un slug de domaine en ID de domaine
 * Exemple: "business" -> "uuid-du-domaine-business"
 */
export const useDomainSlugToId = (slug: string) => {
  return useQuery({
    queryKey: ["domainSlugToId", slug],
    queryFn: async (): Promise<string | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !slug) return null;

      const { data: domain } = await supabase
        .from("domains")
        .select("id")
        .eq("slug", slug)
        .eq("user_id", user.id)
        .maybeSingle();

      return domain?.id || null;
    },
    enabled: !!slug,
    staleTime: Infinity, // Les slugs ne changent pas
  });
};
