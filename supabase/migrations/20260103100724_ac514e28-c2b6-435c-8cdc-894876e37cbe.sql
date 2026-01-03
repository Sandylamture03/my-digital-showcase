-- Add restrictive SELECT policy - no one can read contact submissions via anon key
-- Admin access can be added later when authentication is implemented
CREATE POLICY "No public read access to contact submissions"
ON public.contact_submissions
FOR SELECT
USING (false);