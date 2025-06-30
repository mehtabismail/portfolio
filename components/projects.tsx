"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id='projects' className='scroll-mt-28 mb-28'>
      <SectionHeading>Recent Works</SectionHeading>
      <div>
        {projectsData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
      <div className='grid place-items-center mt-10'>
        <div className='w-full max-w-xs px-4'>
          <Link
            href='/projects'
            className='w-full flex justify-center items-center gap-2 bg-white dark:bg-white/10 text-black dark:text-white px-6 py-3 rounded-full border border-black/10 dark:border-white/20 transition-transform duration-200 hover:scale-105 active:scale-100 focus:outline-none'
            onClick={() => {
              console.log("hello");
            }}
          >
            All Projects
            <BsArrowRight className='opacity-70 group-hover:translate-x-1 transition' />
          </Link>
        </div>
      </div>
    </section>
  );
}
