import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import getProfile from "./tools/get-profile";
import submitContact from "./tools/submit-contact";

export default defineMcp({
  name: "sandeep-portfolio-mcp",
  title: "Sandeep Lamture Portfolio",
  version: "0.1.0",
  instructions:
    "Tools for exploring Sandeep Lamture's portfolio: list projects, browse blog posts, view profile & skills, and send contact messages.",
  tools: [getProfile, listProjects, listBlogPosts, getBlogPost, submitContact],
});
