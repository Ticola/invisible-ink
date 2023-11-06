import React, { useState, useEffect } from 'react';

const ImageAltTable = ({ altTexts, isLoading }) => {
  // State to track if the data is loaded
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);


  // useEffect to set data loaded state when altTexts are loaded
  useEffect(() => {
    if (!isLoading && altTexts && altTexts.length > 0) {
      setIsDataLoaded(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [isLoading, altTexts]); // Run this effect when altTexts changes

  // Conditional rendering based on isDataLoaded
  if (!isDataLoaded) {
    return null; // Or return a loading spinner or any other placeholder
  }

  return (
    <table className={`w-full table-fixed fade-in ${isVisible ? 'visible' : ''}`}>
      <thead>
        <tr>
          <th className="w-1/2 border-b-2 border-gray-400">Image</th>
          <th className="w-1/2 border-b-2 border-gray-400">Alt Text</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {altTexts.map((item, index) => (
          <tr key={index}>
            <td className="p-6 text-center border-r-2 border-b-2 border-gray-200">
              <div className="w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="mx-auto h-auto max-w-full"
                  style={{ maxHeight: '100px' }} // inline style for fixed height or use Tailwind's h-* classes
                />
              </div>
            </td>
            <td className="p-6 break-words border-b-2 border-gray-200">{item.alt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ImageAltTable;
