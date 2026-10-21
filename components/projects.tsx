import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import Image from "next/image";
import { assetPath } from "@/lib/site";

const Skeleton = ({ logo }: { logo?: React.ReactNode }) => (
  <div className="relative flex flex-1 w-full h-full min-h-[10rem] max-h-[10rem] rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/5 overflow-hidden">
    {logo}
  </div>
);

const items = [
  {
    title: "TestiFy",
    description:
      "AI-powered test paper generator that creates structured question papers and solution PDFs from LaTeX generated via Gemini API. Features interactive quiz mode for practice and self-assessment.",
    header: <Skeleton logo={<Image src={assetPath("/testify-logo.jpeg")} alt="TestiFy" fill className="object-cover" />} />,
    className: "md:col-span-1",
    githubLink: "https://github.com/atharvaajmera/TestiFy",
    demoLink: "https://testi-fy.vercel.app/",
  },
  {
    title: "TeamBrain",
    description:
      "Privacy-aware Slack RAG assistant that intelligently retrieves and reconstructs relevant workspace conversations using semantic retrieval and local vector memory for accurate, context-grounded answers.",
    header: <Skeleton />,
    className: "md:col-span-1",
    githubLink: "https://github.com/atharvaajmera/team-brain",
  },
  {
    title: "HealthConnect",
    description:
      "Cross-platform healthcare app with Supabase authentication and real-time location tracking. Manages ambulance tracking with persistent data synchronization and future driver assignment using combinatorial optimization algorithms.",
    header: <Skeleton logo={<Image src={assetPath("/healthconnect-logo.jpeg")} alt="HealthConnect" fill className="object-cover" />} />,
    className: "md:col-span-1",
    githubLink: "https://github.com/atharvaajmera/healthcare",
  },
  {
    title: "Route Finder",
    description:
      "High-performance C++ system solving student-to-centre allotment using OpenStreetMap data. Leverages Graphs, KD-Trees, and Priority Queues for capacity-aware optimal assignments based on travel time.",
    header: <Skeleton logo={<Image src={assetPath("/route-finder-logo.png")} alt="Route Finder" fill className="object-cover" />} />,
    className: "md:col-span-1",
    githubLink: "https://github.com/atharvaajmera/route-finder",
  },
];

export default function Projects() {

  return (
    <section className="relative z-10 min-h-screen bg-[#050505] py-20 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          Some of my <span className="text-blue-500">Projects</span>
        </h2>
        <BentoGrid className="!max-w-5xl mx-auto md:!grid-cols-2 md:gap-6">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              githubLink={item.githubLink}
              demoLink={item.demoLink}
            />
          ))}
        </BentoGrid>
      </motion.div>
    </section>
  );
}