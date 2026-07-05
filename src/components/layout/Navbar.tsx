import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Experience", href: "/#experience" },
  { name: "Education", href: "/#education" },
  { name: "Projects", href: "/#projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>("/resume.pdf");
  const location = useLocation();

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resume_url")
      .maybeSingle()
      .then(({ data }) => { if (data?.value) setResumeUrl(data.value); });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text">
          SL
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith("/#")) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            asChild
          >
            <a href="/resume.pdf" download="Sandeep_Lamture_Resume.pdf">
              <Download className="w-4 h-4 mr-2" />
              Resume
            </a>
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className="md:hidden text-foreground"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass mt-4 mx-6 rounded-2xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4 mt-4">
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 flex-1"
                asChild
              >
                <a href="/resume.pdf" download="Sandeep_Lamture_Resume.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
