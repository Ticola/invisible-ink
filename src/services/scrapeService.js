import axios from 'axios';

const scrapeAltTexts = async (url) => {
  try {
    const response = await axios.post('api/scrape', { url });
    return response.data.altTexts;
  } catch (error) {
    console.error('Error scraping data:', error);

    // Check if the error response has a specific message
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      // Generic error message for other types of errors
      throw new Error("Failed to scrape the website. Please try again.");
    }
  }
};

export { scrapeAltTexts };
