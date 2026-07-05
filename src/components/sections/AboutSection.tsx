import { Code2, Palette, Zap, Users } from "lucide-react";

const skills = {
  "Frontend": [
    "React.js", "Redux", "React Hooks", "JavaScript ES6+", "TypeScript",
    "HTML5", "CSS3", "TailwindCSS", "Bootstrap",
  ],
  "Tools & Build": [
    "Webpack", "Babel", "npm", "Yarn", "Git", "GitHub", "GitLab", "VS Code",
    "Jest", "Enzyme",
  ],
  "APIs & Backend": [
    "REST APIs", "AJAX", "JSON", "Axios", "Fetch API", "GraphQL",
  ],
  "UI/UX & Design": [
    "Responsive Design", "Cross-Browser Compatibility", "Mobile-First",
    "Figma", "Adobe XD", "Accessibility (WCAG)",
  ],
  "Performance": [
    "Code Splitting", "Lazy Loading", "Performance Testing",
    "SEO Optimization", "Web Vitals",
  ],
  "Cloud & DevOps": [
    "AWS", "Netlify", "Vercel", "CI/CD", "Docker", "Kubernetes",
  ],
  "Testing": [
    "Unit Testing", "Integration Testing", "Jest", "React Testing Library",
  ],
  "AI Tools": [
    "GitHub Copilot", "Gemini Developer Studio", "Cursor",
  ],
};

const stats = [
  { label: "Years Experience", value: "4+", icon: Code2 },
  { label: "Bug Reduction", value: "70%", icon: Zap },
  { label: "Performance Boost", value: "35%", icon: Palette },
  { label: "UI Components", value: "15+", icon: Users },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A passionate developer dedicated to crafting exceptional digital experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm a dynamic <span className="text-primary font-semibold">React Developer</span> with
                4 years of experience, known for pioneering user interface innovations and boosting
                team performance through modern development methods. Currently at{" "}
                <span className="text-accent font-semibold">Tata Consultancy Services</span>, I build
                responsive, high-quality web applications that deliver outstanding user experiences.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mt-4">
                I specialize in React.js, JavaScript, and modern CSS, with a focus on optimizing
                application performance, streamlining workflows, and championing coding best
                practices. I'm dedicated to incorporating the latest technologies and improving
                accessibility, ensuring development consistently aligns with business goals and
                drives user engagement.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-6 text-center group hover:glow-primary transition-shadow"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
