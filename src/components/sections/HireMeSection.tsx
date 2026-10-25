import { Briefcase, Code2, Sparkles, LayoutDashboard, Download, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectScoper from "./ProjectScoper";

const services = [
  { icon: Code2, title: "React web apps", text: "Fast, accessible, production-ready front ends." },
  { icon: Sparkles, title: "AI-powered features", text: "LLM agents, content generation, smart automation." },
  { icon: LayoutDashboard, title: "Dashboards & admin tools", text: "Data-heavy UIs with auth and a real backend." },
];

const goContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

const HireMeSection = () => (
  <section id="hire" className="py-24 relative">
    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Work <span className="gradient-text">With Me</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Open to full-time roles and freelance projects — based in Pune, available remote.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-8 flex flex-col">
          <Briefcase className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">For recruiters</h3>
          <p className="text-muted-foreground mb-6 flex-1">
            React & AI Full Stack Developer with 4+ years (TCS, Randstad). Pune, India · open to remote and hybrid.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <a href="/resume.pdf" target="_blank" rel="noreferrer"><Download className="w-4 h-4 mr-2" />Resume</a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://www.linkedin.com/in/sandeep-lamture-00ba4779/" target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</a>
            </Button>
          </div>
        </div>
        <div className="glass rounded-2xl p-8 flex flex-col">
          <h3 className="text-2xl font-bold mb-4">For founders & teams</h3>
          <ul className="space-y-4 mb-6 flex-1">
            {services.map((s) => (
              <li key={s.title} className="flex gap-3">
                <s.icon className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div><p className="font-semibold">{s.title}</p><p className="text-sm text-muted-foreground">{s.text}</p></div>
              </li>
            ))}
          </ul>
          <Button onClick={goContact} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 self-start">
            Start a project
          </Button>
        </div>
      </div>
      <ProjectScoper />
    </div>
  </section>
);

export default HireMeSection;
