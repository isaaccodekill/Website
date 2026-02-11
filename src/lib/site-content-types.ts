// Available illustration options
export const illustrationOptions = [
  { id: "none", label: "No illustration" },
  { id: "cursor", label: "Cursor Icon" },
  { id: "component-tree", label: "Component Tree" },
  { id: "fullstack", label: "Fullstack Diagram" },
  { id: "neural-net", label: "Neural Network" },
] as const;

export type IllustrationId = (typeof illustrationOptions)[number]["id"];

export interface HomeSection {
  id: string;
  title: string;
  text: string;
  illustration: IllustrationId;
  isClosing?: boolean; // For italic styling
}

export interface HomePageContent {
  opening: string;
  frontend: string;
  fullstack: string;
  ai: string;
  closing: string;
}

export interface HomePageSettings {
  sections: HomeSection[];
}

// Default content for the home page
export const defaultHomeContent: HomePageContent = {
  opening: `I still remember the first time I made a computer do something I told it to—a simple "Hello, World!" glowing on a black terminal. In that moment, a door opened.`,
  frontend: `I discovered React and fell in love with component-based thinking—complex interfaces emerging from simple, composable pieces. Frontend taught me that code is a conversation with humans.`,
  fullstack: `I grew restless knowing only half the story. TypeScript, Next.js, APIs, databases, Kubernetes—I dove deeper. Now I build climate action platforms where code might help cities reduce their environmental impact.`,
  ai: `Another door is opening. AI isn't just technological—it's philosophical. How do we think? How do we learn? The mathematics is beautiful. The models are humbling.`,
  closing: `Every week, I write about what I'm learning. If you're curious about software, AI, or the strange art of making machines think—welcome.`,
};

// Default sections with illustrations
export const defaultHomeSections: HomeSection[] = [
  {
    id: "opening",
    title: "Opening",
    text: defaultHomeContent.opening,
    illustration: "cursor",
  },
  {
    id: "frontend",
    title: "Frontend Phase",
    text: defaultHomeContent.frontend,
    illustration: "component-tree",
  },
  {
    id: "fullstack",
    title: "Fullstack Phase",
    text: defaultHomeContent.fullstack,
    illustration: "fullstack",
  },
  {
    id: "ai",
    title: "AI Phase",
    text: defaultHomeContent.ai,
    illustration: "neural-net",
  },
  {
    id: "closing",
    title: "Closing",
    text: defaultHomeContent.closing,
    illustration: "none",
    isClosing: true,
  },
];
