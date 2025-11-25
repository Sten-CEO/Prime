import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Objective {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  domain_id: string;
  category_id: string | null;
  progress: number;
  start_date: string;
  deadline: string;
  status: "on_track" | "at_risk" | "late" | "completed" | "archived";
  importance: "low" | "normal" | "crucial";
  show_on_home: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  archived_at: string | null;
}

export const useObjectives = (domainId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch objectives
  const { data: objectives = [], isLoading } = useQuery({
    queryKey: ["objectives", domainId],
    queryFn: async () => {
      let query = supabase
        .from("objectives")
        .select("*")
        .order("created_at", { ascending: false });

      if (domainId) {
        query = query.eq("domain_id", domainId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Objective[];
    },
  });

  // Create objective
  const createObjective = useMutation({
    mutationFn: async (objective: Omit<Objective, "id" | "user_id" | "created_at" | "updated_at" | "completed_at" | "archived_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("objectives")
        .insert({
          ...objective,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
      toast({
        title: "Objectif créé",
        description: "L'objectif a été ajouté avec succès.",
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

  // Update objective
  const updateObjective = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Objective> & { id: string }) => {
      const { data, error } = await supabase
        .from("objectives")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
      toast({
        title: "Objectif mis à jour",
        description: "Les modifications ont été enregistrées.",
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

  // Delete objective
  const deleteObjective = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("objectives")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
      toast({
        title: "Objectif supprimé",
        description: "L'objectif a été supprimé avec succès.",
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

  // Calculate status based on progress and deadline
  const calculateStatus = (progress: number, deadline: string): "on_track" | "at_risk" | "late" | "completed" => {
    if (progress === 100) return "completed";
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return "late";
    if (progress < 60 && daysUntilDeadline < 7) return "at_risk";
    
    return "on_track";
  };

  return {
    objectives,
    isLoading,
    createObjective: createObjective.mutate,
    updateObjective: updateObjective.mutate,
    deleteObjective: deleteObjective.mutate,
    calculateStatus,
  };
};
