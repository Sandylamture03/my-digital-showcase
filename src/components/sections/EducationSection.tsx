import { GraduationCap, Calendar, MapPin } from "lucide-react";

const education = [
  {
    school: "Nagnath Appa Halge College of Engineering, Parali",
    degree: "Bachelor's Degree — Computer Science Engineering",
    period: "Jun 2015 - Apr 2019",
    location: "Parali, Maharashtra",
    detail: "Computer Science Engineering",
  },
  {
    school: "Shri Yogeshwari Education Society, Ambajogai",
    degree: "Diploma — Computer Science",
    period: "Jul 2011 - May 2015",
    location: "Ambajogai, Maharashtra",
    detail: "Computer Science Engineering",
  },
];

const EducationSection = () => {
  return (
    <section id="education" className="py-24 relative">
      <div className="absolute right-1/4 top-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic foundation in computer science and engineering
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={edu.school}
              className="glass rounded-2xl p-8 hover:glow-primary transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-bold mb-1 group-hover:gradient-text transition-colors">
                {edu.school}
              </h3>
              <p className="text-primary font-semibold mb-4">{edu.degree}</p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{edu.period}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{edu.location}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
                {edu.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
