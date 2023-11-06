import axios from 'axios';

const scrapeAltTexts = async (url) => {
  try {
    const response = await axios.post('/scrape', { url });
    console.log('Received response:', response.data);
    return response.data.altTexts; // Adjust according to how you send back the data
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
};

export { scrapeAltTexts };
