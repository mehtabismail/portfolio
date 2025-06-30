import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";
import { Locum, Mish, WhoU } from "@/public";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
  // {
  //   name: "Detail",
  //   hash: "#detail",
  // },
] as const;

export const experiencesData = [
  {
    title: "Sr. React-Native | Team Lead",
    location: "OutsourceNZ",
    description:
      "Currently i am working in this company as front-end team lead. I have honed my skills in front-end development, and cultivated a deep appreciation for the importance of collaboration in achieving project success.",
    icon: React.createElement(FaReact),
    date: "Oct 2022 - Jun 2025",
  },
  {
    title: "Front-End | React-Native Developer",
    location: "Optimusfox",
    description:
      "I worked for 7 months in this company and During my dynamic 7-month tenure at optimusfox, I played a pivotal role in driving the company's digital presence to new heights.",
    icon: React.createElement(FaReact),
    date: "Apr 2022 - Oct 2022",
  },
  {
    title: "React Native Developer",
    location: "Tribex Technologies",
    description:
      "I started my career as an intern and after 3 months of probation, I started working as a React Native developer for 2 years and 7 months. I also upskilled to the full stack.",
    icon: React.createElement(CgWorkAlt),
    date: "Sept 2019 - Mar 2022",
  },
  {
    title: "Bachelor of Science in Software Engineering",
    location: "University of Lahore",
    description:
      "I graduated with a CGPA of 3.4 and completed specialized courses i.e OOP, Design Patterns, DSA, Object-Oriented Software Engineering, HCI, and Mobile Application Development using Flutter.",
    icon: React.createElement(LuGraduationCap),
    date: "2017-2021",
  },
] as const;

export const projectsData = [
  {
    title: "Mish (Roadie)",
    description:
      "Mish is Aotearoa New Zealand’s latest community-based travel network enabling Kiwis nationwide to share rides across our beautiful country.",
    tags: ["React Native", "Typescript", "Toolkit", "RTK Query"],
    imageUrl: Mish,
  },
  {
    title: "Locum Bridge",
    description:
      "Need a task done quickly and professionally? Look no further! The Locum Bridge app is here to provide top-notch services tailored to your needs.",
    tags: ["React Native", "TypeScript", "View.js", "Tailwind", "Redux"],
    imageUrl: Locum,
  },
  {
    title: "Who U",
    description:
      "Who U is a new mobile app that aims to connect users with like-minded individuals in their area! Our app allows users to see a list of registered users within a certain radius of the user’s location.",
    tags: ["React Native", "Javascript", "Redux"],
    imageUrl: WhoU,
  },
] as const;

export const skillsData = [
  "JavaScript",
  "React Native",
  "React",
  "Redux-Toolkit",
  "TypeScript",
  "WebRTC",
  "Blockchain",
  "Socket",
  "Git",
  "Tailwind",
  "Data Structure",
  "Algorithm",
  "Design Pattern",
] as const;
