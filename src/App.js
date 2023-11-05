import React, { useState } from 'react';
import MainContent from './components/MainContent';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import ImageAltList from './components/ImageAltList';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [altTexts, setAltTexts] = useState([]);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate an API call with a timeout
    setTimeout(() => {
      // This is where you would normally convert the scraped alt texts to an array and set the state
      // For simulation, we're just setting some static text
      setAltTexts(["Example Alt Text 1", "Example Alt Text 2", "[No Alt Text]"]); // Replace with actual scraped alt texts
      setLoading(false);
    }, 2000); // Simulate a network call with a 2-second delay
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <MainContent />
        <div className="mx-auto max-w-4xl p-4">
          <InputForm
            url={url}
            onUrlChange={handleUrlChange}
            onSubmit={handleFormSubmit}
          />
          {loading && <Loader />}
          {!loading && <ImageAltList altTexts={altTexts} />}
        </div>
      </main>
    </div>
  );
}

export default App;
