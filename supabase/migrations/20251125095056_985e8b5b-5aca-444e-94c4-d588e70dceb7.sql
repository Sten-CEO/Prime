-- Add has_insight column to journal_entries
ALTER TABLE public.journal_entries 
ADD COLUMN has_insight BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_journal_entries_has_insight ON public.journal_entries(has_insight) WHERE has_insight = true;

-- Create function to update has_insight when insights are added/removed
CREATE OR REPLACE FUNCTION public.update_entry_has_insight()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.journal_entries
    SET has_insight = true
    WHERE id = NEW.entry_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.journal_entries
    SET has_insight = EXISTS(
      SELECT 1 FROM public.insights 
      WHERE entry_id = OLD.entry_id
    )
    WHERE id = OLD.entry_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to automatically update has_insight
CREATE TRIGGER trigger_update_entry_has_insight
AFTER INSERT OR DELETE ON public.insights
FOR EACH ROW
EXECUTE FUNCTION public.update_entry_has_insight();