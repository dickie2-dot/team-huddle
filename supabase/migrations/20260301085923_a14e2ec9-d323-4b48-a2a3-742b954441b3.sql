
ALTER TABLE public.match_settings
ADD COLUMN recurrence text DEFAULT 'none' CHECK (recurrence IN ('none', 'weekly', 'biweekly'));
