import axios from 'axios';

const scrapeAltTexts = async (url) => {
  try {
    const response = await axios.post('api/scrape', { url });
    return response.data.altTexts;
  } catch (error) {
    console.error('Error scraping data:', error);

    // A user-friendly error message
    let errorMessage = "We're unable to scrape data from this URL. This can happen if the site blocks scraping or requires special access.";

    // You can still log the technical details for debugging purposes
    if (error.response) {
      console.error('Detailed error:', error.response.data.error || error.response.statusText);
    }

    throw new Error(errorMessage);
  }
};

export { scrapeAltTexts };
