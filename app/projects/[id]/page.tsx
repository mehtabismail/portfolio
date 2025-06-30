"use client";

import { useProjectStore } from "@/store/projectStore";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProjectDetail() {
  const {
    id,
    name,
    images,
    description,
    tech,
    web_app_link,
    android_app_link,
    ios_app_link,
    github_link,
    features,
    company,
    role,
  } = useProjectStore((state: any) => state.selectedProject);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= images.length ? 0 : prev + 1));
    }, 3000); // Change every 3s

    return () => clearInterval(timer);
  }, []);

  const visibleImages = images.slice(currentIndex, currentIndex + 3);
  // Loop back to start if at the end
  if (visibleImages.length < 3) {
    visibleImages.push(...images.slice(0, 3 - visibleImages.length));
  }

  if (!id)
    return (
      <h1 className='text-3xl font-bold text-center min-h-[50vh] flex items-center justify-center'>
        No project found
      </h1>
    );

  return (
    <div className='p-6'>
      <h1 className='text-5xl font-bold text-center py-10'>{name}</h1>
      <div className='mx-auto flex justify-center mt-6 w-[60%] overflow-hidden'>
        <div className='flex gap-4 transition-all duration-500 ease-in-out'>
          {visibleImages.map((src: any, i: any) => (
            <img
              key={i}
              src={src}
              alt={`carousel-${i}`}
              className='h-[500px] object-cover rounded-xl shadow'
            />
          ))}
        </div>
      </div>
      <div className='mx-auto mt-6 w-[60%]'>
        <p className='mt-10 text-3xl '>🔍 Overview</p>
        <p className='mt-4 text-gray-500 text-lg whitespace-pre-line'>
          {description}
        </p>
        {features?.length > 0 && (
          <>
            <p className='mt-10 text-3xl '>🔑 Key Features</p>
            <ul className='mt-4 text-gray-500 text-lg'>
              {features?.map((item: string, index: any) => (
                <li key={index} className='list-disc ml-6 mb-1'>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        <p className='mt-10 text-3xl'>🛠️ Tech Stack</p>
        <ul className='mt-4 text-gray-500 text-lg'>
          {tech?.map((item: string, index: any) => (
            <li key={index} className='list-disc ml-6 mb-1'>
              {item}
            </li>
          ))}
        </ul>
        <p className='mt-10 text-3xl'>👤 Role in Project</p>
        <p className='mt-4 text-gray-500 text-lg whitespace-pre-line'>
          {role || "Not specified"}
        </p>
        <p className='mt-10 text-3xl'>🏭 Company</p>
        <p className='mt-4 text-gray-500 text-lg whitespace-pre-line'>
          {company == "Self" ? "Personal Project" : company}
        </p>
      </div>
      <div className='mx-auto mt-24 w-[60%]'>
        <div className='flex flex-wrap gap-4 justify-center'>
          {/* App Store */}
          {!!ios_app_link && (
            <a href={ios_app_link} target='_blank' rel='noopener noreferrer'>
              <img
                src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
                alt='Download on the App Store'
                className='h-12 mr-2'
              />
            </a>
          )}

          {/* Google Play */}
          {!!android_app_link && (
            <a
              href={android_app_link}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                alt='Get it on Google Play'
                className='h-12 mr-2'
              />
            </a>
          )}

          {/* Web App */}
          {!!web_app_link && (
            <a
              href={web_app_link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center border border-black gap-3 px-4 py-2 bg-white text-black rounded-lg shadow-sm hover:bg-gray-100 transition h-12 mr-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6 text-black'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14 5l7 7m0 0l-7 7m7-7H3'
                />
              </svg>
              <div className='text-center'>
                <p className='text-xs leading-none'>Open</p>
                <p className='text-sm font-semibold leading-none'>Web App</p>
              </div>
            </a>
          )}

          {!!github_link && company === "Self" && (
            <a
              href='https://github.com/yourusername/your-repo'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex border border-[#9F9FA0] items-center gap-2 px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                className='w-5 h-5'
              >
                <path d='M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.96.58.1.79-.26.79-.58v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.7.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.53-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.46-2.3 1.2-3.12-.12-.29-.52-1.46.1-3.06 0 0 .97-.31 3.2 1.2a11.18 11.18 0 012.92-.4c.99 0 1.98.13 2.91.4 2.23-1.51 3.2-1.2 3.2-1.2.62 1.6.23 2.77.12 3.06.75.82 1.2 1.86 1.2 3.12 0 4.44-2.7 5.4-5.28 5.68.41.36.78 1.08.78 2.18v3.24c0 .32.21.69.8.58A10.53 10.53 0 0023.5 12C23.5 5.74 18.26.5 12 .5z' />
              </svg>
              <span className='text-sm font-medium'>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
