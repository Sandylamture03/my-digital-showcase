declare const process: { env: Record<string, string | undefined> };

import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List published blog posts from Sandeep Lamture's portfolio, returning title, slug, excerpt, tags, and creation date.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of posts to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, tags, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { posts: data },
    };
  },
});
