"use client";

import { useRef } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const ProjectCard = ({ project }: any) => {
  const { name, live, tech, company, description, thumbnail } = project;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div className='border rounded-lg dark:border-none'>
      <motion.div
        ref={ref}
        style={{
          scale: scaleProgess,
          opacity: opacityProgess,
        }}
        className='group mb-3 sm:mb-8 last:mb-0'
      >
        <section className='m-2 p-4 bg-gray-100 max-w-[42rem] dark:border dark:border-black/5 rounded-lg overflow-hidden sm:pr-8 relative sm:h-[20rem] hover:bg-gray-200 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 min-h-[250px]'>
          {/* {!!live && (
            <label className='absolute top-2 left-2 bg-black text-white px-3 py-1 text-sm rounded-lg z-10'>
              Live
            </label>
          )} */}

          <Image
            src={
              thumbnail ||
              "https://res.cloudinary.com/mehtab/image/upload/v1750991588/projects/krehiickuxx49swtv7sv.jpg"
            }
            alt='Project I worked on'
            quality={100}
            fill
            className='absolute top-8 -right-2 w-[18.25rem] h-40 object-cover rounded-t-lg shadow-2xl
              transition 
              group-hover:scale-[1.04]
              group-hover:-translate-x-6
              group-hover:translate-y-6
              group-hover:-rotate-3

              group-even:group-hover:translate-x-6
              group-even:group-hover:translate-y-6
              group-even:group-hover:rotate-3
      
              group-even:right-[initial] group-even:-left-2'
          />
        </section>
        <div className='m-2 mb-4 p-2 '>
          <div>
            <text className='font-bold text-lg whitespace-nowrap'>
              {name ?? "Project name"}
            </text>
          </div>
          <div
            style={{
              marginTop: 5,
              marginBottom: 5,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <text className='font-semibold text-xs text-gray-500 text-nowrap  '>
              {tech[0] + ", " + tech[1] + ", " + tech[2] + " ..."}
            </text>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCard;
