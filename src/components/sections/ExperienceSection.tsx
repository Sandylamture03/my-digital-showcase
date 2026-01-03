import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    company: "Tata Consultancy Services (TCS)",
    role: "React Developer",
    period: "Oct 2022 - Present",
    location: "Pune, India",
    description: [
      "Developed and maintained scalable React applications for enterprise clients",
      "Implemented Redux Toolkit for efficient state management across complex applications",
      "Reduced bug occurrences by 70% through comprehensive testing strategies",
      "Optimized application performance by 35% using code splitting and lazy loading",
      "Collaborated with cross-functional teams to deliver features on tight deadlines",
    ],
    technologies: ["React.js", "TypeScript", "Redux Toolkit", "TailwindCSS", "REST APIs"],
  },
  {
    company: "Randstad",
    role: "Frontend Developer",
    period: "Sep 2021 - Sep 2022",
    location: "Pune, India",
    description: [
      "Built responsive web applications using React.js and modern JavaScript",
      "Integrated RESTful APIs and GraphQL endpoints for data management",
      "Implemented reusable component libraries for consistent UI across projects",
      "Participated in code reviews and mentored junior developers",
      "Contributed to improving development workflows and best practices",
    ],
    technologies: ["React.js", "JavaScript", "CSS3", "GraphQL", "Git"],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute left-1/4 top-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey in building exceptional web applications
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20 hidden md:block" />

            {experiences.map((exp, index) => (
              <div key={index} className="relative mb-12 last:mb-0">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent hidden md:block mt-8 glow-primary" />

                <div className="md:ml-20 glass rounded-2xl p-8 hover:glow-primary transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:gradient-text transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-lg text-primary font-semibold">{exp.company}</p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={14} />
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="text-primary mt-1.5">▹</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
