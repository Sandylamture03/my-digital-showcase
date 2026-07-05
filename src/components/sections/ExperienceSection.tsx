import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    company: "Tata Consultancy Services",
    role: "React Developer",
    period: "Oct 2022 - Present",
    location: "Pune, India",
    description: [
      "Partnered with designers, back-end developers, and product managers to build, test, and maintain 15+ UI components, ensuring responsive performance across major devices and browsers.",
      "Designed and implemented reusable React.js components and custom hooks, improving code modularity and reducing development time by 30%.",
      "Optimized system performance through code splitting, lazy loading, and profiling, reducing page load time by 35% across Chrome, Firefox, Safari, and Edge.",
      "Led bug fixing and performance tuning with Jest and React Testing Library, resulting in a 70% reduction in production bugs.",
      "Conducted thorough code reviews, enforcing React best practices and clean code principles, improving overall code quality by 40%.",
      "Applied responsive design with TailwindCSS and Bootstrap to deliver pixel-perfect UI across 10+ breakpoints, improving mobile usability by an estimated 25%.",
    ],
    technologies: ["React.js", "TypeScript", "Redux", "TailwindCSS", "Jest", "REST APIs"],
  },
  {
    company: "Randstad India",
    role: "Front End Developer",
    period: "Sep 2021 - Sep 2022",
    location: "Pune, India",
    description: [
      "Developed responsive landing pages and web applications using HTML5, CSS3, JavaScript, and React.js, improving engagement by an estimated 20%.",
      "Accelerated the team's transition to modern front-end development as an early React.js adopter, improving workflow and component reusability by an estimated 25%.",
      "Implemented modern front-end tooling with Webpack, Babel, and npm scripts, streamlining developer workflows by 20%.",
      "Delivered consistent experiences across Chrome, Firefox, Safari, Edge, and IE, reducing browser-specific issues by an estimated 30%.",
      "Integrated front-end components with RESTful APIs using AJAX and Fetch API, reducing integration issues by an estimated 20%.",
    ],
    technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "Webpack", "REST APIs"],
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
