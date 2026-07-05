import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, LogOut, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ResumeUploader from "@/components/admin/ResumeUploader";

export default function AdminPosts() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Admin — Blog Posts</title><meta name="robots" content="noindex" /></Helmet>
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog posts</h1>
            <p className="text-muted-foreground text-sm mt-1">Create, edit, and publish posts.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/posts/new"><Button><Plus className="w-4 h-4 mr-2" />New post</Button></Link>
            <Button variant="ghost" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" />Sign out</Button>
          </div>
        </div>
        <ResumeUploader />


        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !posts?.length ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            <Link to="/admin/posts/new"><Button>Create your first post</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold truncate">{p.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    /{p.slug} · Updated {format(new Date(p.updated_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {p.published && (
                    <Link to={`/blog/${p.slug}`} target="_blank">
                      <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                    </Link>
                  )}
                  <Link to={`/admin/posts/${p.id}`}>
                    <Button variant="secondary" size="sm"><Pencil className="w-4 h-4 mr-1" />Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
