import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = ["React Developer", "Frontend Engineer", "UI/UX Enthusiast"];

const techIcons = [
  { name: "React", icon: "⚛️", delay: 0 },
  { name: "TypeScript", icon: "📘", delay: 0.5 },
  { name: "JavaScript", icon: "💛", delay: 1 },
  { name: "Tailwind", icon: "🎨", delay: 1.5 },
  { name: "Node.js", icon: "🟢", delay: 2 },
  { name: "Git", icon: "🔀", delay: 2.5 },
];

const HeroSection = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const role = roles[currentRole];
    
    if (isTyping) {
      if (displayedText.length < role.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(role.slice(0, displayedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentRole]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {techIcons.map((tech, index) => (
          <div
            key={tech.name}
            className="absolute text-4xl animate-float opacity-30"
            style={{
              left: `${15 + (index * 15) % 70}%`,
              top: `${20 + (index * 12) % 60}%`,
              animationDelay: `${tech.delay}s`,
            }}
          >
            {tech.icon}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 rounded-full glass text-sm text-primary">
              Available for opportunities
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm{" "}
            <span className="gradient-text">Sandeep Lamture</span> — React Developer
          </h1>

          <div className="h-12 md:h-16 mb-8">
            <p className="text-2xl md:text-4xl text-muted-foreground">
              {displayedText}
              <span className="animate-pulse text-primary">|</span>
            </p>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            4+ years of experience crafting high-performance web applications.
            Passionate about creating seamless user experiences with modern technologies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity glow-primary"
              onClick={() => scrollToSection("projects")}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="mailto:sandylamture03@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/sandeep-lamture-00ba4779/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com/Sandylamture03"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("about")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
