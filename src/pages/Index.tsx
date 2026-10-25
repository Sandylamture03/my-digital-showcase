import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import HireMeSection from "@/components/sections/HireMeSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sandeep Lamture — React & AI Full Stack Developer</title>
        <meta
          name="description"
          content="Sandeep Lamture, React & AI full stack developer in Pune with 4+ years. Open to full-time roles and freelance React and AI projects."
        />
        <link rel="canonical" href="https://portfolio.lamsan.online/" />
        <meta property="og:title" content="Sandeep Lamture — React & AI Full Stack Developer" />
        <meta property="og:url" content="https://portfolio.lamsan.online/" />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <HireMeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
