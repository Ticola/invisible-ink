import axios from 'axios';

const scrapeAltTexts = async (url) => {
  try {
    const response = await axios.post('/scrape', { url });
    return response.data.altTexts;
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
};

export { scrapeAltTexts };
