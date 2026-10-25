CREATE TABLE public.scope_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), ip_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.scope_requests TO service_role;
ALTER TABLE public.scope_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX scope_requests_ip_time ON public.scope_requests (ip_hash, created_at);