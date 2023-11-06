const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});


const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/scrape', async (req, res) => {
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

    const getBaseUrl = (url) => {
      const urlObject = new URL(url);
      return urlObject.protocol + '//' + urlObject.host;
    };
    
    const baseUrl = getBaseUrl(url);
    
    $('img').each((i, elem) => {
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
        src = "https://www.whirlpool.com/content/dam/image.jpg";
      }

      const alt = $(elem).attr('alt') || '[No Alt Text]';
      altTexts.push({ src, alt });
    });   

    res.json({ altTexts }); // Send back the result

  } catch (error) {
    console.error('An error occurred during scraping:', error);
    res.status(500).send('An error occurred during scraping.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (e) => {
  console.error(`Error starting server: ${e.message}`);
});
