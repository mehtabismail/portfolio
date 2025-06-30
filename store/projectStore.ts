// store/projectStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  selectedProject: any;
  setProject: (project: any) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      selectedProject: null,
      setProject: (project) => set({ selectedProject: project }),
      clearProject: () => set({ selectedProject: null }),
    }),
    {
      name: "project-storage", // unique key in localStorage
    }
  )
);
