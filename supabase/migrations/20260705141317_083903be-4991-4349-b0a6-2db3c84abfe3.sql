DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

CREATE POLICY "Public can read allowlisted site settings"
ON public.site_settings
FOR SELECT
USING (key IN ('resume_url'));

CREATE POLICY "Admins can read all site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));