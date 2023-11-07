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

    $('img').not('.header img, .footer img, .cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img').each((i, elem) => {
      let src = $(elem).attr('src') || '';
      let alt = $(elem).attr('alt') || '[No Alt Text]';
      let srcset = $(elem).closest('picture').find('source').attr('srcset') || '';

      // Use the srcset if it's available and the src doesn't have a valid URL
      if (!src.match(/^https?:\/\//) && srcset) {
        src = srcset.split(',').map(item => item.trim().split(' ')[0])[0];
      }

      // If src is not a full URL, prepend the base URL
      if (src && !src.match(/^https?:\/\//)) {
        src = new URL(src, baseUrl).href;
      }

      // If src is still not a valid URL, use placeholder
      if (!src.match(/^https?:\/\/.+\/.+/)) {
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
