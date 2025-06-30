"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Link from "next/link";
import { useActiveSectionContext } from "@/context/active-section-context";
import Shimmer from "@/components/shimmer";
import ProjectCard from "./projectCard";
import FullScreenLoader from "@/components/fullScreenLoader";
import { useProjectStore } from "@/store/projectStore";

const ComponentName = () => {
  const [projects, setProjects] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTimePeriod = () => {
    const startDate = new Date("2019-01-01");
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  };

  const { years, months } = getTimePeriod();

  const fetchData = async () => {
    // Fetching data from Firestore
    setIsLoading(true);
    try {
      const docRef = doc(db, "projects", "my_projects");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjects(docSnap.data()?.projects);
        setIsLoading(false);
      } else {
        console.log("No such document!");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching my_projects:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading && <FullScreenLoader />}

      <div className='body w-full'>
        <div className='m-4 p-4 items-center'>
          <h1 className='mx-4 font-semibold text-center text-5xl'>My Work</h1>

          <p className='mx-4 my-10 font-semibold text-2xl text-center text-grey-500'>
            With over {years} year{years !== 1 && "s"} of hands-on programming
            experience, I’ve built a wide range of impactful and real-world
            applications—many of which are personal passion projects. Below are
            a few of my latest works, but there's much more to explore.
          </p>

          <div className='flex flex-wrap m-2'>
            {projects.length > 0 &&
              projects.map((item: any) => (
                <Link
                  key={item?.id}
                  href={`/projects/${item?.name}`}
                  onClick={() => {
                    useProjectStore.getState().setProject(item);
                  }}
                  className='w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 p-2'
                >
                  <ProjectCard project={item} />
                </Link>
              ))}
          </div>
          <p className='mx-4 my-10 font-semibold text-2xl text-center text-grey-500'>
            👉 This is just the beginning—head over to my{" "}
            <a
              href='https://github.com/mehtabismail'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 underline hover:text-blue-700'
            >
              GitHub
            </a>{" "}
            to see the rest of my work.
          </p>
        </div>
      </div>
    </>
  );
};

export default ComponentName;
