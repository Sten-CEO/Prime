import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FreePerformanceRecord } from "@/lib/scoring";

export const useFreePerformanceRecords = (
  domainId?: string,
  categoryId?: string,
  startDate?: string,
  endDate?: string
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: freePerformanceRecords = [], isLoading } = useQuery({
    queryKey: ["free_performance_records", domainId, categoryId, startDate, endDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("free_performance_records")
        .select(`
          *,
          free_performances!inner(domain_id, category_id, name)
        `)
        .eq("user_id", user.id);

      if (domainId) {
        query = query.eq("free_performances.domain_id", domainId);
      }

      if (categoryId) {
        query = query.eq("free_performances.category_id", categoryId);
      }

      if (startDate) {
        query = query.gte("recorded_date", startDate);
      }

      if (endDate) {
        query = query.lte("recorded_date", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformer les données pour correspondre au format FreePerformanceRecord
      return (data || []).map(record => ({
        id: record.id,
        user_id: record.user_id,
        free_performance_id: record.free_performance_id,
        domain_id: (record.free_performances as any).domain_id,
        category_id: (record.free_performances as any).category_id,
        recorded_date: record.recorded_date,
        impact_value: record.impact_value,
        created_at: record.created_at,
        label: (record.free_performances as any).name,
      })) as (FreePerformanceRecord & { label: string })[];
    },
  });

  const createFreePerformanceRecord = useMutation({
    mutationFn: async (data: {
      label: string;
      domain_id: string;
      category_id?: string | null;
      recorded_date: string;
      impact_value: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // D'abord créer la free_performance si elle n'existe pas
      const { data: freePerf, error: perfError } = await supabase
        .from("free_performances")
        .insert({
          user_id: user.id,
          name: data.label,
          domain_id: data.domain_id,
          category_id: data.category_id || null,
        })
        .select()
        .single();

      if (perfError) throw perfError;

      // Ensuite créer l'enregistrement
      const { data: record, error: recordError } = await supabase
        .from("free_performance_records")
        .insert({
          user_id: user.id,
          free_performance_id: freePerf.id,
          recorded_date: data.recorded_date,
          impact_value: data.impact_value,
        })
        .select()
        .single();

      if (recordError) throw recordError;

      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free_performance_records"] });
      queryClient.invalidateQueries({ queryKey: ["free_performances"] });
      queryClient.invalidateQueries({ queryKey: ["domain_stats"] });
      queryClient.invalidateQueries({ queryKey: ["category_stats"] });
      queryClient.invalidateQueries({ queryKey: ["domain-performance"] });
      queryClient.invalidateQueries({ queryKey: ["category-performance"] });
      toast({
        title: "Performance enregistrée",
        description: "La performance libre a été ajoutée avec succès.",
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

  const deleteFreePerformanceRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from("free_performance_records")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free_performance_records"] });
      queryClient.invalidateQueries({ queryKey: ["free_performances"] });
      queryClient.invalidateQueries({ queryKey: ["domain_stats"] });
      queryClient.invalidateQueries({ queryKey: ["category_stats"] });
      queryClient.invalidateQueries({ queryKey: ["domain-performance"] });
      queryClient.invalidateQueries({ queryKey: ["category-performance"] });
      toast({
        title: "Performance supprimée",
        description: "L'enregistrement a été supprimé.",
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
    freePerformanceRecords,
    isLoading,
    createFreePerformanceRecord: createFreePerformanceRecord.mutate,
    deleteFreePerformanceRecord: deleteFreePerformanceRecord.mutate,
  };
};
