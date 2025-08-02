import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

// Normalizes a tech name (e.g., removes .js, spaces, etc.) and maps it using the mappings object for standardized naming.
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings]
};

// Checks if a tech logo URL exists on the server using a lightweight HEAD request.
const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Return true if the icon exists
  } catch {
    return false;
  }
}

// Generates URLs for each tech’s logo, checks if each logo exists, and falls back to a default icon if not.
export const getTechLogos = async (techArray: string[]) => {
  console.log("techArray received:", techArray);
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech, 
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    }
  })

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg"
    }))
  );

  return results;
};

// Selects and returns a random interview cover image path from the interviewCovers array
export const getRandomInterviewCover  = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length)
  return `/covers${interviewCovers[randomIndex]}`;
};
