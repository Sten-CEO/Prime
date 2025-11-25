-- Create objectives table for Prime Targets
CREATE TABLE public.objectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  domain_id UUID NOT NULL,
  category_id UUID,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'late', 'completed', 'archived')),
  importance TEXT NOT NULL DEFAULT 'normal' CHECK (importance IN ('low', 'normal', 'crucial')),
  show_on_home BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own objectives"
ON public.objectives
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own objectives"
ON public.objectives
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own objectives"
ON public.objectives
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own objectives"
ON public.objectives
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_objectives_updated_at
BEFORE UPDATE ON public.objectives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_objectives_user_domain ON public.objectives(user_id, domain_id);
CREATE INDEX idx_objectives_status ON public.objectives(status);
CREATE INDEX idx_objectives_deadline ON public.objectives(deadline);