"use client";

import { useEffect, useState } from "react";

export function useLifestyleProfile() {
  const [profile, setProfile] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const saved = window.localStorage.getItem("lifestyle-profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        setProfile({});
      }
    }
  }, []);

  const saveProfile = (nextProfile: Record<string, unknown>) => {
    setProfile(nextProfile);
    window.localStorage.setItem("lifestyle-profile", JSON.stringify(nextProfile));
  };

  return { profile, saveProfile };
}
