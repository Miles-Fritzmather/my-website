"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import BetterLink from "~/components/BetterLink";
import Container from "~/components/Container";
import { HStack, VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { cn } from "~/lib/utils";
import BouncingArrow from "../../components/bouncing-arrow";
import { FadeIn, FadeInText } from "../../components/fade-in";

type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  startDate: Date;
} & (
  | {
      status: "active" | "on-hold";
      completedDate?: never;
    }
  | {
      status: "completed";
      completedDate: Date;
    }
);

const projects = [
  {
    title: "LHD Developer Fellow",
    link: "https://github.com/Longhorn-Developers/Degree-Audit-Plus",
    description:
      "Longhorn Devleopers (or LHD) is a club at UT Austin that works to make the lives of students easier through open source technologies. When I first joined the club, I worked on the Degree Audit Plus Team where I built a Chrome extension that streamlines the degree audit process by integrating with the official degree audit tool and providing a more user-friendly interface.",
    startDate: new Date("September 28, 2025"),
    completedDate: new Date("May, 2025"),
    tags: [
      "Chrome extensions",
      "TypeScript",
      "React",
      "Open Source",
      "WXT",
      "Collaborative",
      "Built for production",
    ],
    status: "completed",
  },
  {
    title: "LHD Developer Lead",
    link: "https://github.com/Longhorn-Developers/Spark-Plus",
    description:
      "For my second semester at UT, I joined another team in LHD except this time as the Technical lead. Here I was working on building out extra tooling for UT's Enterprise AI tooling, Spark. As the tech lead I was responsible for organizing the team, designing the architecture, and also writing code along side the other developers.",
    startDate: new Date("January, 2026"),
    completedDate: new Date("May, 2025"),
    tags: [
      "CloudFlare Workers",
      "MCPs",
      "AI",
      "Collaborative",
      "Enterprise Technolgy",
      "Leading a team",
      "Architecture design",
    ],
    status: "completed",
  },
  {
    title: "LHD SWE Director",
    link: "https://github.com/Longhorn-Developers",
    description:
      "As of this summer, I have been promoted to the SWE Director of LHD. This means I am now responsible for overseeing the entire software engineering department of over 50 members across 13 teams. I am also responsible for helping recruit new members to all the teams, building out cross team collaboration and communication efforts, and monitoring the progress of all the teams along with code quality.",
    startDate: new Date("May, 2026"),
    tags: [
      "Software Engineering",
      "Collaborative",
      "Leading a team",
      "Architecture design",
      "Project management",
      "Recruiting",
      "Communication",
    ],
    status: "active",
  },
  {
    title: "Abaddon",
    link: "https://abaddon.ianyourgod.dev/play",
    description:
      "This is a video game that I am building with a small group of people I met at the Game Worlds summer camp. The game is a top-down 2D adventur game where the player can explore a world and fight enemies.",
    startDate: new Date("June 14, 2024"),
    status: "on-hold",
    tags: ["C#", "Unity", "Game Development", "Leading a team"],
  },
  {
    title: "BioBQ",
    link: "https://www.biobqing.com/",
    description:
      "This is a company I was an intern for over the 2024 school year as a part of my dual credit level 1 biotechnology certification. The company is small start up working on creating lab grown brisket. My work involved multiple projects including a computer vision model to classify a meat samples quality and a software program to analyse a reactors's cell viability and confluency non-invasively.",
    tags: [
      "Python",
      "Computer Vision",
      "Machine Learning",
      "Biotechnology",
      "Research",
      "Intern",
      "Collaborative",
    ],
    status: "completed",
    startDate: new Date("August 2024"),
    completedDate: new Date("June 2025"),
  },
  {
    title: "Game Worlds",
    link: "https://game-worlds-camp.itch.io/",
    description:
      "This is a summer camp I attended for many years (2018-2023) and then worked at as a counselor for the 2024 and 2025 summers. Each session of the camp is a week long game jam where at the end all teams present to a panel of industry professionals. The camp is open to anyone 8-18 years old and prides itself on being a safe and welcoming environment for all.",
    tags: [
      "Construct 3",
      "Game Development",
      "Summer Camp",
      "C#",
      "Unity",
      "Counselor",
      "Collaborative",
      "Leading a team",
    ],

    status: "completed",
    startDate: new Date("August 2018"),
    completedDate: new Date("July 2025"),
  },
  {
    title: "Raycast Extensions",
    description:
      "This is was my first experience with open source development. Raycast is a productivity tool for macOS that I use and all its extensions are open source so I have made extensions of my own and suggested changes to pre-existing ones as well. The tech stack of the extensions is library made by Raycast that builds off React and uses TypeScript. The extensions I have made often use some kind of Apple Script to interact with the system.",
    startDate: new Date("February 24, 2025"),
    tags: [
      "Open Source",
      "React",
      "UI/UX Design",
      "TypeScript",
      "Apple Script",
      "Raycast",
    ],
    status: "completed",
    completedDate: new Date("October 2025"),
  },
  {
    title: "Hilliard & Shadowen",
    description:
      "This is a multi-billion dollar law firm that I worked for as a contracter. My work involved creating a software program to analyse large legal PDF documents and convert them into excel files that I gave back to the firm for further analysis. The program uses a mix of the PyPDF and PDFMiner libraries to parse the PDF documents.",
    startDate: new Date("September, 2024"),
    tags: ["Python", "PyPDF", "PDFMiner", "Contract Work", "Legal"],
    status: "completed",
    completedDate: new Date("October 2025"),
  },
  {
    title: "Politicosmos: Hacktx",
    link: "http://75.81.64.177/home",
    description:
      "This was a 24 hour hackathon I participated in with a team of 4 other students. Our project was a web application that displayed congressional bills in a 3D galaxy for users to explore while also learning about the bils. Our team won first place out of more than 100 teams competing in the novice category. The hackathon was hosted by HachTX.",
    startDate: new Date("October 18, 2025"),
    tags: [
      "Hackathon",
      "Web Development",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Full Stack Development",
      "UI/UX Design",
      "Machine Learning",
      "Dimensional Analysis",
      "Collaborative",
    ],
    status: "completed",
    completedDate: new Date("October 19, 2025"),
  },
  {
    title: "Relay",
    link: "https://relay-law.com",
    description:
      "This is a company I am starting to build entirely local AI servers for lawyers. The system is simple to set up and runs entirely on the lawyers own server we supply them with. The reason I wanted to make this is the legal industry currently has hundreds of AI tools for everything and anything, but none truly promise security and safety of the client's information to a degree we, or many lawyers, thought was necessary. With an entirely local system, we can ensure that the client's information is never sent to a third party and is always kept private and secure.",
    startDate: new Date("January, 2026"),
    tags: [
      "Start Up",
      "Full Stack Development",
      "UI/UX Design",
      "Collaborative",
      "Tech Lead",
      "AI",
      "Legal",
    ],
    status: "active",
  },
  {
    title: "JotIt",
    // link: "https://milesfm.me/jotit",
    description:
      "This is a simple note taking app inspired by Raycast's floating notes feature. However, this one is actually free with unlimited notes, and is open source for people to use and contribute to. It's nothing crazy, but I love it and use it every day.",
    startDate: new Date("June, 2026"),
    tags: ["Tauri", "App Development", "Open Source", "Product"],
    status: "active",
  },
  {
    title: "WriteRight",
    // link: "https://milesfm.me/write-right",
    description:
      "This is an iPad app for taking handwritten notes like GoodNotes, except the art style is meant to be like a real notebook. The design is inspired by the Apple Design Award Winner, Grug, which uses a handwritten style for all of its user interface.",
    startDate: new Date("July, 2026"),
    tags: ["iPad OS", "Product", "SwiftUI", "Open Source"],
    status: "active",
  },
  // {
  //   title: "UT",
  //   description:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //   startDate: new Date("August 2025"),
  //   tags: [],
  //   summary:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //   status: "active",
  // },
  // {
  //   title: "LASA",
  //   description:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //   startDate: new Date(),
  //   tags: [],
  //   summary:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //   status: "completed",
  //   completedDate: new Date("August 2025"),
  // },
] satisfies Project[];

const ProjectsPage = () => {
  return (
    <VStack y="top" x="center" className="w-full">
      <HeroBanner />
      <div className="mx-auto w-full">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-medium text-foreground">
            Project Timeline
          </h1>
          <p className="text-lg text-muted-foreground">
            A chronological journey through my recent work
          </p>
        </div>

        <ProjectTimeline projects={projects} />
      </div>
    </VStack>
  );
};

const ProjectTimeline = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-border"
        style={
          {
            // background:
            //   "linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
          }
        }
      />

      {/* Timeline items */}
      <div className="space-y-12">
        {projects
          .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
          .map((project, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={index} className="relative">
                <div
                  className={cn(
                    "absolute top-6",
                    isLeft ? "left-[calc(50%+2rem)]" : "right-[calc(50%+2rem)]",
                  )}
                >
                  <div className="w-full max-w-lg">
                    <span className="text-2xl font-bold text-foreground/40">
                      {project.startDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 top-8 h-4 w-4 -translate-x-1/2 rounded-full border-[3.5px] border-background bg-primary" />

                {/* Card container */}
                <div
                  className={`flex ${
                    isLeft
                      ? "justify-start pr-[calc(50%+2rem)]"
                      : "justify-end pl-[calc(50%+2rem)]"
                  }`}
                >
                  <div className="w-full max-w-lg">
                    <ProjectCard project={project} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ProjectSkillChip = ({ skill }: { skill: string }) => {
  return (
    <HStack
      centered
      gap={2}
      className="rounded-full border border-primary/10 bg-primary/5 px-2 py-1"
    >
      <span className="text-sm">{skill}</span>
    </HStack>
  );
};

const ProjectStatusChip = ({ status }: { status: Project["status"] }) => {
  const styles = {
    active: {
      shadow: "rgba(0, 255, 0, 0.1)",
      chip: "bg-yellow-500/10 border border-yellow-500/30 border-2 text-yellow-500",
    },
    "on-hold": {
      shadow: "rgba(255, 255, 0, 0.1)",
      chip: "bg-orange-500/10 border border-orange-500/30 border-2 text-orange-500",
    },
    completed: {
      shadow: "rgba(255, 0, 0, 0.1)",
      chip: "bg-green-500/10 border border-green-500/30 border-2 text-green-500",
    },
  };

  return (
    <HStack
      centered
      gap={2}
      className={cn("rounded-full px-2 py-1", styles[status].chip)}
      style={{
        boxShadow: `0 0 10px 0 ${styles[status].shadow}`,
      }}
    >
      <span className="text-sm">{status}</span>
    </HStack>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const projectHref =
    project.link && !project.link.startsWith("http")
      ? `https://${project.link}`
      : project.link;
  const isExternalLink =
    typeof projectHref === "string" && /^https?:\/\//.test(projectHref);

  return (
    <Container className="w-full">
      <VStack className="gap-4">
        <HStack y="middle" x="between" fill>
          <h3 className="text-3xl font-bold">{project.title}</h3>
          <HStack centered gap={3}>
            <ProjectStatusChip status={project.status} />
            {projectHref && (
              <BetterLink
                href={projectHref}
                className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 p-2 text-sm font-medium transition-colors hover:bg-primary/20"
                target={isExternalLink ? "_blank" : undefined}
                rel={isExternalLink ? "noopener noreferrer" : undefined}
                aria-label={`Learn more about ${project.title}`}
              >
                <FaExternalLinkAlt />
              </BetterLink>
            )}
          </HStack>
        </HStack>
        <p className="text-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <ProjectSkillChip skill={tag} key={tag} />
          ))}
        </div>
      </VStack>
    </Container>
  );
};

const HeroBanner = () => {
  return (
    <VStack centered gap={20} className="h-[100vh] w-full">
      <VStack centered gap={5}>
        <h1 className="whitespace-nowrap text-9xl font-black">
          <Popup scaleIncrease={1.2} pullForce={1 / 10} shrinkOnClick>
            <span className="inline-flex whitespace-nowrap">
              <FadeInText text="My Projects" delayBetween={0.05} />
            </span>
          </Popup>
        </h1>
        <FadeIn index={2}>
          <h1 className="text-6xl font-extrabold tracking-tight text-foreground/40">
            {`Let's see what I've been working on!`}
          </h1>
        </FadeIn>
      </VStack>
      <BouncingArrow />
    </VStack>
  );
};

export default ProjectsPage;
