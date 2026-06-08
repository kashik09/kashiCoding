"use client";

import { useEffect } from "react";

/**
 * Auto-switches theme based on time of day:
 * - Morning (6am - 6pm): light theme
 * - Dusk (6pm - 9pm): dusk theme
 * - Cabin (9pm - 6am): dark/cabin theme
 */
export function AutoTheme() {
  useEffect(() => {
    const getThemeForTime = (): "morning" | "dusk" | "cabin" => {
      const hour = new Date().getHours();

      if (hour >= 6 && hour < 18) {
        return "morning";
      } else if (hour >= 18 && hour < 21) {
        return "dusk";
      } else {
        return "cabin";
      }
    };

    const applyTheme = () => {
      const theme = getThemeForTime();
      document.documentElement.dataset.theme = theme;
    };

    // Apply immediately
    applyTheme();

    // Check every minute for theme changes
    const interval = setInterval(applyTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
