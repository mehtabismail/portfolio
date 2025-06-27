"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Link from "next/link";
import { useActiveSectionContext } from "@/context/active-section-context";
import Shimmer from "@/components/shimmer";
import ProjectCard from "./projectCard";

const ComponentName = () => {
  const [projects, setProjects] = useState<any>([]);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const fetchData = async () => {
    console.log("fetching data from Firebase...");
    try {
      const docRef = doc(db, "projects", "my_projects");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjects(docSnap.data()?.projects);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching my_projects:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='body w-full'>
      <div className='m-4 p-4 items-center'>
        <h1 className='mx-4 font-semibold text-2xl text-grey-900'>
          List of Projects
        </h1>
        <div className='flex flex-wrap m-2'>
          {projects.length > 0 ? (
            projects?.map((item: any) => (
              <Link
                className='w-1/5'
                key={item?.info?.id}
                href='#contact'
                onClick={() => {
                  setActiveSection("Contact");
                  setTimeOfLastClick(Date.now());
                }}
              >
                <ProjectCard project={item} />
              </Link>
            ))
          ) : (
            <Shimmer />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentName;
