import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MetricEvent } from "@/lib/scoring";

export const useMetricRecords = (domainId?: string, startDate?: string, endDate?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: metricRecords = [], isLoading } = useQuery({
    queryKey: ["metric_records", domainId, startDate, endDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("metric_records")
        .select(`
          *,
          metrics!inner(domain_id, category_id)
        `)
        .eq("user_id", user.id);

      if (domainId) {
        query = query.eq("metrics.domain_id", domainId);
      }

      if (startDate) {
        query = query.gte("recorded_date", startDate);
      }

      if (endDate) {
        query = query.lte("recorded_date", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformer les données pour correspondre au format MetricEvent
      return (data || []).map(record => ({
        id: record.id,
        user_id: record.user_id,
        metric_id: record.metric_id,
        domain_id: (record.metrics as any).domain_id,
        category_id: (record.metrics as any).category_id,
        recorded_date: record.recorded_date,
        units: 1, // Par défaut, une métrique complétée = 1 unité
        custom_impact: record.custom_impact,
        created_at: record.created_at,
      })) as MetricEvent[];
    },
  });

  const recordMetricCompletion = useMutation({
    mutationFn: async (data: {
      metric_id: string;
      recorded_date: string;
      custom_impact?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Vérifier si l'enregistrement existe déjà pour ce jour
      const { data: existing } = await supabase
        .from("metric_records")
        .select("id")
        .eq("metric_id", data.metric_id)
        .eq("recorded_date", data.recorded_date)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Mettre à jour l'enregistrement existant
        const { data: updated, error } = await supabase
          .from("metric_records")
          .update({
            custom_impact: data.custom_impact,
            created_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      } else {
        // Créer un nouvel enregistrement
        const { data: inserted, error } = await supabase
          .from("metric_records")
          .insert({
            user_id: user.id,
            metric_id: data.metric_id,
            recorded_date: data.recorded_date,
            performance_level: "simple", // Valeur par défaut
            custom_impact: data.custom_impact,
          })
          .select()
          .single();

        if (error) throw error;
        return inserted;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metric_records"] });
      queryClient.invalidateQueries({ queryKey: ["domain_stats"] });
      queryClient.invalidateQueries({ queryKey: ["category_stats"] });
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

  const deleteMetricRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from("metric_records")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metric_records"] });
      queryClient.invalidateQueries({ queryKey: ["domain_stats"] });
      queryClient.invalidateQueries({ queryKey: ["category_stats"] });
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

  return {
    metricRecords,
    isLoading,
    recordMetricCompletion: recordMetricCompletion.mutate,
    deleteMetricRecord: deleteMetricRecord.mutate,
  };
};
