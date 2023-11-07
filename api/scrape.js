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
    const excludedSelectors = '.header img, .footer img, .cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img';
    
    const getBaseUrl = (inputUrl) => {
      const urlObject = new URL(inputUrl);
      return urlObject.protocol + '//' + urlObject.host;
    };

    const baseUrl = getBaseUrl(url);

    // Process 'picture' elements
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

      if (src && !processedSrcs.has(src)) {
        processedSrcs.add(src);
        altTexts.push({ src, alt });
      }
    });

    // Process 'img' elements not inside 'picture' tags and not within excluded selectors
    $('img').not(`${excludedSelectors} img, picture img`).each((i, imgElem) => {
      let src = $(imgElem).attr('src') || $(imgElem).attr('data-src') || '';
      let alt = $(imgElem).attr('alt') || '[No Alt Text]';

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      if (src && !processedSrcs.has(src) && src.match(/^https?:\/\/.+\/.+/)) {
        processedSrcs.add(src);
        altTexts.push({ src, alt });
      } else if (!src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
        altTexts.push({ src, alt });
      }
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
