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
    const altTexts = [];
    const processedSrcs = new Set(); // To keep track of processed src values
    const excludedSelectors = '.cmp-experiencefragment--header picture, .cmp-experiencefragment--Header picture, .cmp-experiencefragment--footer picture, .cmp-experiencefragment--whirlpool-meganav picture';

    const getBaseUrl = (inputUrl) => {
      const urlObject = new URL(inputUrl);
      return urlObject.protocol + '//' + urlObject.host;
    };

    const baseUrl = getBaseUrl(url);

    $('picture').not(excludedSelectors).each((i, pictureElem) => {
      const imgElem = $(pictureElem).find('img');
      let src = imgElem.attr('src') || imgElem.attr('data-src') || '';
      let alt = imgElem.attr('alt') || '[No Alt Text]';
      const sourceElem = $(pictureElem).find('source[data-srcset], source[srcset]').first();
      const dataSrcset = sourceElem.attr('data-srcset') || sourceElem.attr('srcset');

      if (dataSrcset) {
        src = dataSrcset.split(',')[0].trim().split(' ')[0];
      }

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      if (src && !processedSrcs.has(src)) { // Check if this src has not been processed before
        processedSrcs.add(src); // Add src to processedSrcs to avoid duplicates later
        altTexts.push({ src, alt });
      }
    });

    $('img').not('picture img').each((i, imgElem) => { // Select img elements that are not inside picture elements
      let src = $(imgElem).attr('src') || $(imgElem).attr('data-src') || '';
      let alt = $(imgElem).attr('alt') || '[No Alt Text]';

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      if (src && !processedSrcs.has(src) && src.match(/^https?:\/\/.+\/.+/)) {
        processedSrcs.add(src); // Add src to processedSrcs to track it
        altTexts.push({ src, alt }); // Push the image information
      } else if (!src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
        altTexts.push({ src, alt }); // Push the placeholder image information
      }
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
