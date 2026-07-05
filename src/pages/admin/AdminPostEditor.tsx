import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import PostPreview from "@/components/admin/PostPreview";

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function AdminPostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id!).single();
      if (error) { toast.error(error.message); navigate("/admin"); return; }
      setTitle(data.title);
      setSlug(data.slug);
      setSlugTouched(true);
      setExcerpt(data.excerpt);
      setCoverImage(data.cover_image ?? "");
      setTagsInput((data.tags ?? []).join(", "));
      setContent(data.content);
      setPublished(!!data.published);
      setLoading(false);
    })();
  }, [id, isNew, navigate]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

  const save = async (publishOverride?: boolean) => {
    if (!title.trim() || !slug.trim() || !excerpt.trim()) {
      toast.error("Title, slug, and excerpt are required");
      return;
    }
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      cover_image: coverImage.trim() || null,
      tags,
      published: publishOverride ?? published,
    };
    setSaving(true);
    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Post created");
      navigate(`/admin/posts/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id!);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      if (publishOverride !== undefined) setPublished(publishOverride);
      toast.success("Saved");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  const form = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="post-slug" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Short summary shown in listings and previews" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cover">Cover image</Label>
        <div className="flex gap-2">
          <Input id="cover" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://… or upload below" />
          {coverImage && (
            <Button type="button" variant="ghost" onClick={() => setCoverImage("")}>Clear</Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            id="cover-file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
              setUploading(true);
              try {
                const ext = file.name.split(".").pop() || "jpg";
                const path = `${crypto.randomUUID()}.${ext}`;
                const { error: upErr } = await supabase.storage.from("blog-covers").upload(path, file, { contentType: file.type });
                if (upErr) throw upErr;
                const { data, error: urlErr } = await supabase.storage.from("blog-covers").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
                if (urlErr) throw urlErr;
                setCoverImage(data.signedUrl);
                toast.success("Cover uploaded");
              } catch (err: any) {
                toast.error(err.message ?? "Upload failed");
              } finally {
                setUploading(false);
              }
            }}
          />
          <Button type="button" variant="secondary" disabled={uploading} onClick={() => document.getElementById("cover-file")?.click()}>
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          {coverImage && (
            <img src={coverImage} alt="Cover preview" className="h-16 w-28 object-cover rounded-md border border-border" />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="react, typescript" />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published" className="cursor-pointer">Published</Label>
      </div>
    </div>
  );

  const preview = (
    <PostPreview
      title={title}
      excerpt={excerpt}
      content={content}
      coverImage={coverImage}
      tags={tags}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>{isNew ? "New post" : "Edit post"} — Admin</title><meta name="robots" content="noindex" /></Helmet>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link to="/admin">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />All posts</Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => save()} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />{saving ? "Saving…" : "Save"}
            </Button>
            {!published && (
              <Button onClick={() => save(true)} disabled={saving}>Save & publish</Button>
            )}
            {published && (
              <Button variant="outline" onClick={() => save(false)} disabled={saving}>Unpublish</Button>
            )}
          </div>
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          <div>{form}</div>
          <div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto pr-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Live preview</div>
            {preview}
          </div>
        </div>

        {/* Mobile: tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="edit">
            <TabsList className="w-full">
              <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4">{form}</TabsContent>
            <TabsContent value="preview" className="mt-4">{preview}</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
