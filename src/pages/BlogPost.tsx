import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4 gradient-text">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-foreground">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 -ml-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ) : !post ? (
              <div className="text-center py-16">
                <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                <p className="text-muted-foreground mb-8">
                  The blog post you're looking for doesn't exist.
                </p>
                <Link to="/blog">
                  <Button>Back to Blog</Button>
                </Link>
              </div>
            ) : (
              <article>
                <header className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={18} />
                      <span>Sandeep Lamture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{Math.ceil(post.content.split(" ").length / 200)} min read</span>
                    </div>
                  </div>
                </header>

                {post.cover_image && (
                  <div className="rounded-2xl overflow-hidden mb-12">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>
                )}

                <div className="glass rounded-2xl p-8 md:p-12">
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-primary pl-6">
                    {post.excerpt}
                  </p>

                  <div className="prose prose-invert max-w-none">
                    {renderContent(post.content)}
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
