import React, { useEffect } from 'react';
import CloseIcon from './CloseIcon';

const ErrorMessage = ({ message, clearError }) => {
  useEffect(() => {
    // Close the modal when the Esc key is pressed
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) clearError(); // 27 is the keycode for the Esc key
    };

    // Add event listener for the Esc key
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearError]);

  // Function to close the modal
  const handleClose = () => {
    clearError();
  };

  // Function to stop propagation of click events inside the modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!message) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="modal-close" onClick={handleClose}>
          <CloseIcon />
        </button>
        {message}
      </div>
    </div>
  );
};

export default ErrorMessage;
