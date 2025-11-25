import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Metric {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
  category_id: string | null;
  domain_id: string;
  user_id: string;
  default_impact_simple: number;
  default_impact_advanced: number;
  default_impact_exceptional: number;
  created_at: string;
  updated_at: string;
}

export const useMetrics = (categoryId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ["metrics", categoryId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Metric[];
    },
    enabled: !!categoryId,
  });

  const createMetric = useMutation({
    mutationFn: async (metric: { 
      name: string; 
      icon?: string; 
      category_id: string;
      domain_id: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("metrics")
        .insert({
          ...metric,
          user_id: user.id,
          is_active: true,
          default_impact_simple: 20,
          default_impact_advanced: 50,
          default_impact_exceptional: 80,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      toast({
        title: "Métrique créée",
        description: "La nouvelle métrique a été créée avec succès.",
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

  const updateMetric = useMutation({
    mutationFn: async (metric: { 
      id: string; 
      name?: string; 
      icon?: string;
      is_active?: boolean;
    }) => {
      const { id, ...updates } = metric;
      const { data, error } = await supabase
        .from("metrics")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("metrics")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      toast({
        title: "Métrique supprimée",
        description: "La métrique a été supprimée avec succès.",
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
    metrics,
    isLoading,
    createMetric: createMetric.mutate,
    updateMetric: updateMetric.mutate,
    deleteMetric: deleteMetric.mutate,
  };
};
