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

    const getBaseUrl = (inputUrl) => {
      const urlObject = new URL(inputUrl);
      return urlObject.protocol + '//' + urlObject.host;
    };

    const baseUrl = getBaseUrl(url);

    $('img, picture').not('.cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img').each((i, elem) => {
      let src = $(elem).attr('data-src') || $(elem).attr('src') || '';
      let alt = $(elem).attr('alt') || '[No Alt Text]';
      const picture = $(elem).is('picture') ? $(elem) : $(elem).closest('picture');

      // If the element is a picture with source elements
      if (picture.length) {
        // Prefer data-srcset or srcset from the source elements within the picture
        const sourceElem = picture.find('source[data-srcset], source[srcset]').first();
        src = sourceElem.attr('data-srcset') || sourceElem.attr('srcset');
        
        if (src) {
          // Take the first src from srcset
          src = src.split(',')[0].trim().split(' ')[0];
        } else {
          // If no srcset, use the img src or data-src
          const imgElem = picture.find('img');
          src = imgElem.attr('data-src') || imgElem.attr('src') || '';
          alt = imgElem.attr('alt') || '[No Alt Text]';
        }
      } else if ($(elem).is('img')) {
        // For img elements, simply use src or data-src
        src = $(elem).attr('data-src') || $(elem).attr('src') || '';
      }

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      if (!src || !src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
      }

      altTexts.push({ src, alt });
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
