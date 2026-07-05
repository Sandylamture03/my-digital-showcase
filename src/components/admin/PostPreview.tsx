import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface Props {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

export default function PostPreview({ title, excerpt, content, coverImage, tags }: Props) {
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.ceil(words / 200));

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{tag}</span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{title || "Untitled post"}</h1>
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2"><User size={16} /><span>Sandeep Lamture</span></div>
          <div className="flex items-center gap-2"><Calendar size={16} /><span>{format(new Date(), "MMMM d, yyyy")}</span></div>
          <div className="flex items-center gap-2"><Clock size={16} /><span>{readMin} min read</span></div>
        </div>
      </header>

      {coverImage && (
        <div className="rounded-2xl overflow-hidden mb-10">
          <img src={coverImage} alt={title} className="w-full h-56 md:h-80 object-cover" />
        </div>
      )}

      <div className="glass rounded-2xl p-6 md:p-10">
        {excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-primary pl-6">
            {excerpt}
          </p>
        )}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "<p><em>Nothing to preview yet.</em></p>" }}
        />
      </div>
    </article>
  );
}
