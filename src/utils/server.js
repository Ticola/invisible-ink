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
  console.log('Scrape request received:', req.body);

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

    $('img').each((i, elem) => {
      altTexts.push($(elem).attr('alt'));
    });
    console.log(`Sending back alt texts: ${altTexts}`);

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
