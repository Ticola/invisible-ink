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

    $('img').not('.cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || '';
      let alt = $(elem).attr('alt') || '[No Alt Text]';
      let isFlyoutImg = $(elem).parents('.flyout-img').length > 0;

      if (isFlyoutImg) {
        // For images within .flyout-img, we look for a source element with the data-srcset attribute.
        const sourceElem = $(elem).closest('picture').find('source[data-srcset]').first();
        let dataSrcset = sourceElem.attr('data-srcset');

        if (dataSrcset) {
          src = dataSrcset.split(',')[0].trim().split(' ')[0];
        }
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
