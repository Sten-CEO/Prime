import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface Domain {
  id: string;
  name: string;
  slug: string;
  user_id: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export const useDomains = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Domain[];
    },
  });

  // Créer les domaines par défaut si aucun domaine n'existe
  useEffect(() => {
    const initializeDefaultDomains = async () => {
      if (!isLoading && domains.length === 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.rpc('create_default_domains', {
            user_id_param: user.id
          });
          
          if (!error) {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
          }
        }
      }
    };

    initializeDefaultDomains();
  }, [isLoading, domains.length, queryClient]);

  const createDomain = useMutation({
    mutationFn: async (domain: { name: string; slug: string; icon?: string; color?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("domains")
        .insert({
          ...domain,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast({
        title: "Domaine créé",
        description: "Le nouveau domaine a été créé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDomain = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("domains")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast({
        title: "Domaine supprimé",
        description: "Le domaine a été supprimé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    domains,
    isLoading,
    createDomain: createDomain.mutate,
    deleteDomain: deleteDomain.mutate,
  };
};
