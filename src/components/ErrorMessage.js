import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      console.log("ErrorMessage received:", message); // Add this line
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`error-message fade-in ${isVisible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;
