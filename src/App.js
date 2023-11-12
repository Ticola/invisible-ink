import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import Footer from './components/Footer';
import ImageAltTable from './components/ImageAltTable';
import ErrorMessage from './components/ErrorMessage';
import { scrapeAltTexts } from './services/scrapeService';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [altTexts, setAltTexts] = useState([]);
  const [error, setError] = useState(null);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset error state on new form submission
  
    try {
      const fetchedAltTexts = await scrapeAltTexts(url);
      setAltTexts(fetchedAltTexts);
    } catch (error) {
      console.error('Error fetching alt texts:', error);
      setError(error.message); // Set the error message
      console.log("Error occurred:", error.message); // Add this line to check the error
      setAltTexts([]);
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
          <ErrorMessage message={error} />
          {!loading && !error && altTexts && <ImageAltTable altTexts={altTexts} />}
        </div>
      </main>
      <Footer />
    </div>
  );  
}

export default App;
