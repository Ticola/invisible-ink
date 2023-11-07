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
    
    const images = $('img').not('.cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img');

    images.each((i, elem) => {
      // Determine the image source. Prefer 'src' over 'data-src', and 'srcset' over 'data-srcset' when available
      let src = $(elem).attr('src') || $(elem).attr('data-src') || '';
      let srcset = $(elem).attr('srcset') || $(elem).attr('data-srcset') || '';

      // If the image is within a .flyout-img, attempt to use the srcset
      if ($(elem).parents('.flyout-img').length && srcset) {
        src = srcset.split(',')[0].trim().split(' ')[0];
      }

      // If src is a relative URL, prepend the base URL
      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      // If src is still not a valid URL, use placeholder
      if (!src || !src.match(/^https?:\/\/.+\/.+/)) {
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1362px-Placeholder_view_vector.svg.png";
      }

      // Get alt text
      const alt = $(elem).attr('alt') || '[No Alt Text]';
      
      // Push the src and alt into the altTexts array
      altTexts.push({ src, alt });
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
