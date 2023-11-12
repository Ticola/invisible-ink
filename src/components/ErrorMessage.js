import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Optionally set a timeout to hide the message after some time
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // 3 seconds for example

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
