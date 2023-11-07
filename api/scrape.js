const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const altTexts = new Set();

    const getBaseUrl = (inputUrl) => {
      const urlObject = new URL(inputUrl);
      return urlObject.protocol + '//' + urlObject.host;
    };

    const baseUrl = getBaseUrl(url);

    // Process each picture element and its children source and img tags
    $('picture').not('.cmp-experiencefragment--header picture, .cmp-experiencefragment--Header picture, .cmp-experiencefragment--footer picture, .cmp-experiencefragment--whirlpool-meganav picture').each((i, picture) => {
      const sources = $(picture).find('source[data-srcset], source[srcset]');
      const img = $(picture).find('img');
      let src = '';
      let alt = img.attr('alt') || '[No Alt Text]';

      if (sources.length) {
        // Prefer data-srcset or srcset from the source elements within the picture
        const sourceElem = sources.first();
        src = sourceElem.attr('data-srcset') || sourceElem.attr('srcset');
        src = src.split(',')[0].trim().split(' ')[0]; // Take the first src from srcset
      } else {
        // If no sources are found, fall back to the img src or data-src
        src = img.attr('src') || img.attr('data-src') || '';
      }

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href; // Resolve the src to a full URL if it's a relative path
      }

      if (!src || !src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
      }

      altTexts.push({ src, alt });
    });

    res.json(Array.from(altTexts)); // Convert the Set to an Array for the response
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
