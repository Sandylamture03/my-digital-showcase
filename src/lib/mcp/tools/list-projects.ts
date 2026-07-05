declare const process: { env: Record<string, string | undefined> };

import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "list_projects",
  title: "List portfolio projects",
  description:
    "Retrieve Sandeep Lamture's portfolio projects with title, description, tech stack, live demo URL, and source code URL.",
  inputSchema: {
    featured_only: z
      .boolean()
      .optional()
      .describe("If true, only return featured projects."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ featured_only }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    let query = supabase
      .from("projects")
      .select("title, description, tech_stack, live_url, github_url, featured")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (featured_only) query = query.eq("featured", true);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { projects: data },
    };
  },
});
