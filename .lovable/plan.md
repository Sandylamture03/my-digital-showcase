## Goal
Add a protected admin interface for managing blog posts (`blog_posts` table) with a rich text editor and side-by-side preview.

## Scope
The `blog_posts` table already exists with admin-only write policies gated by `has_role(auth.uid(), 'admin')`. It currently has no UI to write to it. This plan adds authentication, an admin dashboard, and an editor.

## New routes
- `/auth` — email/password sign-in (no public sign-up, to avoid strangers creating accounts)
- `/admin` — dashboard listing all posts (draft + published) with edit/delete/new buttons
- `/admin/posts/new` — editor for a new post
- `/admin/posts/:id` — editor for existing post

All `/admin/*` routes wrapped in a `RequireAdmin` guard that checks the current session and `has_role` before rendering; redirects to `/auth` otherwise.

## Editor UI (`BlogPostEditor` component)
Two-column layout on desktop, tabs on mobile:

**Left — form**
- Title (auto-slugifies to the slug field; slug remains editable)
- Excerpt (textarea)
- Cover image URL
- Tags (comma-separated input → string[])
- Published toggle
- Content: rich text editor
- Save / Save & publish / Delete / Cancel buttons

**Right — live preview**
Renders exactly like the public `/blog/:slug` page using the current form state, so the author sees the final look while typing.

## Rich text editor
Use **Tiptap** (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`). It's the standard React rich-text stack, works cleanly with shadcn styling, and outputs HTML we can store in `content` and render on the public post page.

Toolbar: bold, italic, strike, H2/H3, bullet list, ordered list, blockquote, code block, link, image (by URL), undo/redo.

Content stored as HTML string in the existing `content` column (text). `BlogPost.tsx` currently renders content as plain text/markdown; it will be updated to render the stored HTML inside the existing prose container.

## Auth
Enable Supabase email/password auth. Only accounts explicitly granted the `admin` role in `user_roles` reach `/admin` — a signed-in non-admin sees an "access denied" state. Because there's no public sign-up form, admin accounts are provisioned by inserting into `user_roles` (one-time seed migration will grant the first admin role to a user id the user provides, or we surface a small "make me admin" helper the first time).

## Data flow
- List: `select *` (admin-only policy already covers drafts).
- Create: `insert` with title, slug, excerpt, content, cover_image, tags, published.
- Update: `update ... where id = ...`.
- Delete: `delete ... where id = ...`.
All go through the existing `@/integrations/supabase/client`.

## Files
New:
- `src/pages/Auth.tsx`
- `src/pages/admin/AdminPosts.tsx`
- `src/pages/admin/AdminPostEditor.tsx`
- `src/components/admin/RequireAdmin.tsx`
- `src/components/admin/RichTextEditor.tsx` (Tiptap wrapper + toolbar)
- `src/components/admin/PostPreview.tsx` (mirrors public post layout)

Edited:
- `src/App.tsx` — register new routes.
- `src/pages/BlogPost.tsx` — render stored HTML via `dangerouslySetInnerHTML` inside the prose container (content originates from trusted admin authors).
- `src/components/Header.tsx` (or nav) — add small "Admin" link visible only when signed in as admin (optional).

## Out of scope
- Image uploads to storage (URL-based images only for now; can add a storage bucket later).
- Public sign-up, password reset flows, multi-author permissions.
- Markdown import/export.

## Verification
After build: sign in as an admin user, create a draft post, toggle preview, publish it, confirm it appears on `/blog` and renders correctly at `/blog/:slug`; edit and delete round-trip; confirm a signed-out user hitting `/admin` is redirected to `/auth`.