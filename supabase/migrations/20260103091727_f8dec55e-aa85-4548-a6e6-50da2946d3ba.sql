-- Create contact_submissions table for storing form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions (public form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published blog posts
CREATE POLICY "Anyone can read published posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects
CREATE POLICY "Anyone can read projects"
ON public.projects
FOR SELECT
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for blog_posts updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, tags, published) VALUES
('Building Scalable React Applications', 'building-scalable-react-applications', 'Learn the best practices for building large-scale React applications with proper architecture and state management.', '# Building Scalable React Applications\n\nWhen building large React applications, architecture matters. Here are key principles I follow...\n\n## Component Architecture\n\nKeep components small and focused. Use composition over inheritance.\n\n## State Management\n\nChoose the right tool: Context for simple apps, Redux/Zustand for complex ones.\n\n## Performance\n\nMemo, useMemo, and useCallback are your friends - but use them wisely.', ARRAY['React', 'Architecture', 'Best Practices'], true),
('TypeScript Best Practices for 2024', 'typescript-best-practices-2024', 'Essential TypeScript patterns and practices every developer should know in 2024.', '# TypeScript Best Practices\n\nTypeScript continues to evolve. Here are patterns I use daily...\n\n## Strict Mode\n\nAlways enable strict mode for better type safety.\n\n## Utility Types\n\nMaster Partial, Pick, Omit, and Record.\n\n## Generic Constraints\n\nUse extends to constrain generics for better type inference.', ARRAY['TypeScript', 'JavaScript', 'Best Practices'], true),
('Mastering TailwindCSS', 'mastering-tailwindcss', 'From utility-first skeptic to Tailwind advocate - my journey and tips for effective Tailwind usage.', '# Mastering TailwindCSS\n\nI was skeptical at first, but Tailwind changed how I style applications...\n\n## Design System\n\nExtend the config to create your design system.\n\n## Component Patterns\n\nExtract repeated patterns into components, not @apply.\n\n## Dark Mode\n\nBuilt-in dark mode support makes theming effortless.', ARRAY['CSS', 'TailwindCSS', 'Frontend'], true);

-- Insert sample projects
INSERT INTO public.projects (title, description, image, tech_stack, live_url, github_url, featured) VALUES
('E-Commerce Dashboard', 'A comprehensive admin dashboard for e-commerce platforms with real-time analytics, inventory management, and order tracking.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', ARRAY['React', 'TypeScript', 'TailwindCSS', 'Chart.js'], 'https://example.com', 'https://github.com', true),
('Task Management App', 'Collaborative task management application with real-time updates, drag-and-drop functionality, and team workspaces.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800', ARRAY['React', 'Redux Toolkit', 'Socket.io', 'Node.js'], 'https://example.com', 'https://github.com', true),
('Weather Forecast PWA', 'Progressive web app providing accurate weather forecasts with beautiful visualizations and offline support.', 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800', ARRAY['React', 'TypeScript', 'PWA', 'Weather API'], 'https://example.com', 'https://github.com', true),
('Social Media Analytics', 'Analytics platform for social media managers to track engagement, growth, and content performance across platforms.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', ARRAY['React', 'D3.js', 'REST APIs', 'PostgreSQL'], 'https://example.com', 'https://github.com', false);