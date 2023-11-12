import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ message, clearError }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }

    const handleKeyDown = (event) => {
      if (event.keyCode === 27) { // 27 is the keycode for the Esc key
        clearError();
      }
    };

    // Add event listener for the Esc key
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [message, clearError]);

  // Function to close the modal
  const handleClose = () => {
    clearError();
  };

  // Function to stop propagation of click events inside the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="modal-close" onClick={handleClose}>X</button>
        {message}
      </div>
    </div>
  );
};

export default ErrorMessage;
