declare const process: { env: Record<string, string | undefined> };

import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Fetch the full content of a published blog post by its slug from Sandeep Lamture's portfolio.",
  inputSchema: {
    slug: z.string().min(1).describe("URL slug of the blog post."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, content, tags, created_at, updated_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: `No post found with slug "${slug}"` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { post: data },
    };
  },
});
