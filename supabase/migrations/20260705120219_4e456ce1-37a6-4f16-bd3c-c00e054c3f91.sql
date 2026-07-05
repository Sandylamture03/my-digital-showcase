UPDATE public.blog_posts 
SET 
  excerpt = 'Learn the best practices for building large-scale React applications with proper architecture and state management.',
  content = 'When building large React applications, architecture matters. Here are key principles I follow...

## Component Architecture
- Keep components small and focused.
- Use composition over inheritance.

## State Management
- Choose the right tool: Context for simple apps, Redux/Zustand for complex ones.

## Performance
- Memo, useMemo, and useCallback are your friends - but use them wisely.'
WHERE slug = 'building-scalable-react-applications';