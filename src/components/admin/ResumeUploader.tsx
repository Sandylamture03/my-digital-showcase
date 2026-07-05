import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Upload, ExternalLink } from "lucide-react";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years

export default function ResumeUploader() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resume_url")
      .maybeSingle();
    setCurrentUrl(data?.value ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const path = `resume-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { contentType: "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { data: signed, error: urlErr } = await supabase.storage
        .from("site-assets")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (urlErr) throw urlErr;

      const { error: dbErr } = await supabase
        .from("site_settings")
        .upsert({ key: "resume_url", value: signed.signedUrl }, { onConflict: "key" });
      if (dbErr) throw dbErr;

      setCurrentUrl(signed.signedUrl);
      toast.success("Resume updated");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <div>
          <h2 className="font-semibold">Resume</h2>
          <p className="text-xs text-muted-foreground">Replace the PDF served by the Resume button.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input id="resume-file" type="file" accept="application/pdf" className="hidden" onChange={onFile} />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => document.getElementById("resume-file")?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading…" : currentUrl ? "Replace resume" : "Upload resume"}
        </Button>
        {loading ? (
          <span className="text-xs text-muted-foreground">Loading…</span>
        ) : currentUrl ? (
          <a href={currentUrl} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
            View current <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Using default /resume.pdf</span>
        )}
      </div>
    </div>
  );
}
