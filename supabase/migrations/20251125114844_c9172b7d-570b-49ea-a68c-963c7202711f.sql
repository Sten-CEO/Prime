-- Create domains table
CREATE TABLE IF NOT EXISTS public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metrics table
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  default_impact_simple INTEGER NOT NULL DEFAULT 1,
  default_impact_advanced INTEGER NOT NULL DEFAULT 2,
  default_impact_exceptional INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metric_records table
CREATE TABLE IF NOT EXISTS public.metric_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_id UUID NOT NULL REFERENCES public.metrics(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  performance_level TEXT NOT NULL CHECK (performance_level IN ('simple', 'advanced', 'exceptional')),
  custom_impact INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_id, recorded_date)
);

-- Create free_performances table
CREATE TABLE IF NOT EXISTS public.free_performances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create free_performance_records table
CREATE TABLE IF NOT EXISTS public.free_performance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  free_performance_id UUID NOT NULL REFERENCES public.free_performances(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  impact_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(free_performance_id, recorded_date)
);

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_performance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for domains
CREATE POLICY "Users can view their own domains" ON public.domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own domains" ON public.domains FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own domains" ON public.domains FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own domains" ON public.domains FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for metrics
CREATE POLICY "Users can view their own metrics" ON public.metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own metrics" ON public.metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own metrics" ON public.metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own metrics" ON public.metrics FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for metric_records
CREATE POLICY "Users can view their own metric records" ON public.metric_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own metric records" ON public.metric_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own metric records" ON public.metric_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own metric records" ON public.metric_records FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for free_performances
CREATE POLICY "Users can view their own free performances" ON public.free_performances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own free performances" ON public.free_performances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own free performances" ON public.free_performances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own free performances" ON public.free_performances FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for free_performance_records
CREATE POLICY "Users can view their own free performance records" ON public.free_performance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own free performance records" ON public.free_performance_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own free performance records" ON public.free_performance_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own free performance records" ON public.free_performance_records FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON public.metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_free_performances_updated_at BEFORE UPDATE ON public.free_performances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();