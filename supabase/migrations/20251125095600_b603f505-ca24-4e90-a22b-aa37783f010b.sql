-- Add hidden_from_home column to insights table
ALTER TABLE public.insights 
ADD COLUMN hidden_from_home BOOLEAN DEFAULT false;