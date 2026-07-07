import { useState, useEffect } from 'react';

/**
 * Custom hook to manage carousel state and auto-rotation intervals.
 * @param {number} length - The total number of items in the carousel array.
 * @param {number} intervalMs - The interval time in milliseconds for rotation.
 * @returns {number} The current active index.
 */
export const useCarousel = (length, intervalMs = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return; // No need to rotate if 0 or 1 item

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % length);
    }, intervalMs);

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, [length, intervalMs]);

  return currentIndex;
};