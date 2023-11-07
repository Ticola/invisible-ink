const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Only allow POST method
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

    // Exclude images within .cmp-experiencefragment--header and .cmp-experiencefragment--footer
    $('img').not('.cmp-experiencefragment--header img').not('.cmp-experiencefragment--footer img').each((i, elem) => {
      let src = $(elem).attr('src') || '';
      // If src is not a full URL, check if it's a relative path or a placeholder
      if (!src.match(/^https?:\/\//)) {
        // If src is a placeholder, attempt to find a srcset in a parent <picture> element
        if (src.startsWith('?') || src === '') {
          const srcset = $(elem).closest('picture').find('source').attr('srcset');
          if (srcset) {
            // If srcset is a relative path, prepend the base URL
            src = new URL(srcset.split(' ')[0], baseUrl).href;
          }
        } else if (src) {
          // If src is a relative path, prepend the base URL
          src = new URL(src, baseUrl).href;
        }
      }

      // If src is still not a valid URL, use placeholder
      if (!src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
      }

      const alt = $(elem).attr('alt') || '[No Alt Text]';
      altTexts.push({ src, alt });
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
