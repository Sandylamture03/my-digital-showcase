import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get profile & contact info",
  description:
    "Get Sandeep Lamture's professional profile: role, experience summary, tech skills, and contact information.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      name: "Sandeep Lamture",
      title: "React Developer",
      experience_years: 4,
      location: "Pune, Maharashtra, India",
      summary:
        "React Developer with 4+ years of experience building scalable, high-performance web applications. Currently at Tata Consultancy Services (TCS).",
      contact: {
        email: "sandylamture03@gmail.com",
        phone: "+91 9503250303",
        linkedin: "https://www.linkedin.com/in/sandeep-lamture-00ba4779/",
        github: "https://github.com/Sandylamture03",
        portfolio: "https://portfolio.lamsan.online",
      },
      skills: {
        frontend: [
          "React.js",
          "TypeScript",
          "JavaScript",
          "Redux",
          "TailwindCSS",
          "HTML5",
          "CSS3",
          "SCSS",
        ],
        tools: ["Git", "GitHub", "VS Code", "Webpack", "Vite"],
        apis: ["REST APIs", "GraphQL", "Axios", "React Query", "WebSockets"],
        cloud: ["AWS (Basic)", "Firebase", "Vercel", "Netlify"],
      },
      experience: [
        {
          company: "Tata Consultancy Services (TCS)",
          role: "React Developer",
          period: "Oct 2022 - Present",
        },
        {
          company: "Randstad",
          role: "Frontend Developer",
          period: "Sep 2021 - Sep 2022",
        },
      ],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
