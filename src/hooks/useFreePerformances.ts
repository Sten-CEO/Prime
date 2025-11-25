import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FreePerformance {
  id: string;
  name: string;
  category_id: string | null;
  domain_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useFreePerformances = (categoryId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: freePerformances = [], isLoading } = useQuery({
    queryKey: ["free_performances", categoryId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("free_performances")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FreePerformance[];
    },
    enabled: !!categoryId,
  });

  const createFreePerformance = useMutation({
    mutationFn: async (performance: { 
      name: string; 
      category_id: string;
      domain_id: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("free_performances")
        .insert({
          ...performance,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free_performances"] });
      toast({
        title: "Performance ajoutée",
        description: "La nouvelle performance a été ajoutée avec succès.",
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

  const updateFreePerformance = useMutation({
    mutationFn: async (performance: { 
      id: string; 
      name?: string;
    }) => {
      const { id, ...updates } = performance;
      const { data, error } = await supabase
        .from("free_performances")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free_performances"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFreePerformance = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("free_performances")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free_performances"] });
      toast({
        title: "Performance supprimée",
        description: "La performance a été supprimée avec succès.",
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
    freePerformances,
    isLoading,
    createFreePerformance: createFreePerformance.mutate,
    updateFreePerformance: updateFreePerformance.mutate,
    deleteFreePerformance: deleteFreePerformance.mutate,
  };
};
