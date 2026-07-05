import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sandeep Lamture — React & Full Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Sandeep Lamture, a React and full-stack developer with 4+ years building high-performance web apps in TypeScript, Node.js, and Tailwind."
        />
        <link rel="canonical" href="https://portfolio.lamsan.online/" />
        <meta property="og:title" content="Sandeep Lamture — React & Full Stack Developer Portfolio" />
        <meta property="og:url" content="https://portfolio.lamsan.online/" />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
