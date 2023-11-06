import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 1;
        if (newProgress === 100) {
          clearInterval(intervalId);
        }
        return newProgress;
      });
    }, 100); // You can control the speed of the loading here

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Calculate the strokeDashoffset for the SVG circle
  const circumference = 2 * Math.PI * 54; // The radius of the circle is 54
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <svg className="progress-circle-svg" width="120" height="120" viewBox="0 0 120 120">
          <circle className="progress-circle-back" cx="60" cy="60" r="54" fill="none" stroke="#eee" strokeWidth="12"/>
          <circle className="progress-circle-prog" cx="60" cy="60" r="54" fill="none" stroke="#3498db" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset}/>
        </svg>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
