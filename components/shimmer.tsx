"use client";
import React from "react";

const Shimmer = () => {
  const projects = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  console.log("shimmer component rendered");
  return projects.map((item: any, index) => (
    <div
      key={index}
      className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2'
    ></div>
  ));

  // <div className='shimmer-container'>
  //   <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  //   <div className='shimmer-card'></div>
  // </div>
};

export default Shimmer;
