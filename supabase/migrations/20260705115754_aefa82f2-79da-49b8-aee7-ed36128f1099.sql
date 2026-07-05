UPDATE public.blog_posts 
SET 
  title = 'TypeScript Best Practices for 2026',
  excerpt = 'Essential TypeScript patterns and practices every developer should know in 2026.',
  content = 'Here is a scannable, bullet-point summary of the core TypeScript best practices for 2026:

Swap Type Assertions for satisfies: Avoid using as Type or rigid type annotations on configurations. Use the satisfies operator to validate your objects against a type schema without losing the specific, narrow inferred types of their properties.

Enforce Max Strictness in tsconfig.json: Go beyond "strict": true. Explicitly enable "noUncheckedIndexedAccess" to force safety checks on array and object lookups, and "exactOptionalPropertyTypes" to prevent mixing up omitted fields with explicit undefined values.

Model Complex State with Discriminated Unions: Eliminate multi-optional object fields (e.g., data?, error?, loading?). Instead, use a single, explicit literal property (like status: ''loading'' | ''success'' | ''error'') to safely guard conditional code blocks.

Use const Type Parameters for Clean Immutability: Add the const modifier directly to generic type parameters in utility functions. This forces TypeScript to infer strict, read-only literal types from inputs without requiring the caller to append as const manually.

Adopt Branded Types to Kill "Primitive Obsession": Prevent bugs caused by passing the wrong string ID to the wrong function parameter. Create compile-time nominal types (Branded Types) so UserId and OrderId are treated as distinct types, even though both are just strings at runtime.'
WHERE slug = 'typescript-best-practices-2024';