declare const process: { env: Record<string, string | undefined> };

import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "submit_contact_message",
  title: "Send contact message",
  description:
    "Send a contact message to Sandeep Lamture through his portfolio. The message is saved and Sandeep is notified by email.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Sender's full name."),
    email: z.string().trim().email().max(255).describe("Sender's email address."),
    message: z.string().trim().min(10).max(1000).describe("Message body (10-1000 characters)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, message }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, message }]);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    // Fire-and-forget email notification
    try {
      await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message },
      });
    } catch (e) {
      // Message saved even if email fails
    }

    return {
      content: [{ type: "text", text: "Message sent successfully. Sandeep will get back to you soon." }],
      structuredContent: { success: true },
    };
  },
});
