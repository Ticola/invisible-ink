# Invisible Ink - Image Alt-Text Scraper

Invisible Ink is a web-based tool designed to simplify the process of extracting alt text from images on any given webpage. This tool is particularly useful for content authors and developers who need to audit or collect alt text for accessibility compliance or for SEO purposes.

## Features

- **Ease of Use**: Simply enter a URL, and Invisible Ink will scrape the alt texts from images on the page.
- **Efficiency**: Automates the process that would otherwise require manual inspection using browser tools.
- **Flexibility**: Handles various image scenarios including those wrapped in `<picture>` elements.

## Technologies Used

- **Frontend**: The user interface is built with [React](https://reactjs.org/), providing a reactive and modular approach to UI development.
- **Styling**: Utilizes [Tailwind CSS](https://tailwindcss.com/) for sleek, utility-first styling that is responsive and customizable.
- **Backend**: Powered by [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/), creating a robust server environment for handling scraping logic.
- **Scraping**: Leverages [Axios](https://github.com/axios/axios) for HTTP requests and [Cheerio](https://cheerio.js.org/) for server-side DOM manipulation to extract data.
- **Deployment**: Hosted on [Vercel](https://vercel.com/), offering a seamless CI/CD pipeline, from git push to global deployment.

## Usage

Visit the deployed app on Vercel: [Invisible Ink Live](https://invisible-ink.vercel.app/)

1. Input the full URL of the webpage you wish to scrape.
2. Click the "Scrape" button to initiate the process.
3. View the extracted alt texts displayed in a table format.
