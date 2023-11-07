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

    const getBaseUrl = (inputUrl) => {
      const urlObject = new URL(inputUrl);
      return urlObject.protocol + '//' + urlObject.host;
    };

    const baseUrl = getBaseUrl(url);

    // Process all 'img' and 'picture img' elements in the order they appear in the HTML
    $('picture, img').not('header img, .footer img, .cmp-experiencefragment--header img, .cmp-experiencefragment--Header img, .cmp-experiencefragment--footer img, .cmp-experiencefragment--whirlpool-meganav img').each((i, elem) => {
      let src, alt;

      if (elem.tagName.toLowerCase() === 'picture') {
        const imgElem = $(elem).find('img');
        alt = imgElem.attr('alt') || '[No Alt Text]';
        const sourceElem = $(elem).find('source[data-srcset], source[srcset]').first();
        const dataSrcset = sourceElem.attr('data-srcset') || sourceElem.attr('srcset');

        if (dataSrcset) {
          src = dataSrcset.split(',')[0].trim().split(' ')[0];
        } else {
          src = imgElem.attr('src') || imgElem.attr('data-src') || '';
        }
      } else {
        src = $(elem).attr('src') || $(elem).attr('data-src') || '';
        alt = $(elem).attr('alt') || '[No Alt Text]';
      }

      if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
        src = new URL(src, baseUrl).href;
      }

      if (src && !processedSrcs.has(src)) {
        processedSrcs.add(src);
        altTexts.push({ src, alt });
      }
    });

    res.json({ altTexts });
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping.' });
  }
};
