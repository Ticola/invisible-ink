import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import ImageAltList from './components/ImageAltList';
import { scrapeAltTexts } from './services/scrapeService';

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
  
    try {
      // Use the service function to get the alt texts
      const fetchedAltTexts = await scrapeAltTexts(url);
      setAltTexts(fetchedAltTexts);
      console.log('Updated alt texts state:', fetchedAltTexts);
    } catch (error) {
      console.error('Error fetching alt texts:', error);
      // Here you can set an error state and show an error message to the user if needed
      setAltTexts([]); // Setting to an empty array or handling as needed
    }
  
    setLoading(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <MainContent />
        <div className="mx-auto max-w-4xl p-4">
          <InputForm
            url={url}
            onUrlChange={handleUrlChange}
            onSubmit={handleFormSubmit}
          />
          {loading && <Loader />}
          {!loading && altTexts && <ImageAltList altTexts={altTexts} />}
        </div>
      </main>
    </div>
  );
}

export default App;
