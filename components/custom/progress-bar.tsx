"use client";

import React, { useState, useEffect } from "react";

const messages = [
  "Initializing...",
  "Loading data...",
  "Processing...",
  "Almost there...",
  "Finalizing...",
];

const MINIMUM_DURATION = 3000;

export default function AppProgressBar() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const timeProgress = Math.min(
        (elapsedTime / MINIMUM_DURATION) * 100,
        100,
      );

      setProgress((oldProgress) => {
        const targetProgress = Math.max(timeProgress, oldProgress);
        if (targetProgress === 100) {
          clearInterval(timer);
          return 100;
        }

        const increment = Math.random() * 10;
        const newProgress = Math.min(
          Math.min(oldProgress + increment, targetProgress + 5),
          100,
        );

        setMessageIndex(
          Math.floor((newProgress / 100) * (messages.length - 1)),
        );

        return newProgress;
      });
    }, 200);

    const completionTimer = setTimeout(() => {
      setProgress(100);
      setMessageIndex(messages.length - 1);
    }, MINIMUM_DURATION);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, [startTime]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-2 h-4 bg-muted rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-center min-h-[1.5rem]">
        <p key={messageIndex} className="animate-fade-in text-muted-foreground text-sm">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
}
