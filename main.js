// Import necessary libraries
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Set the URL to crawl
const url = "https://www.iban.com/exchange-rates";

// Call the fetchData function and handle the response
fetchData(url).then((res) => {
  // Parse the HTML using Cheerio
  const html = res.data;
  const $ = cheerio.load(html);

  // Find the table and extract the data
  const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
  const data = [];

  statsTable.each(function () {
    // Extract the table cell data and remove any unwanted characters
    let title = $(this).find('td').text();
    let newStr = title.split("\t");
    newStr.shift();
    data.push(newStr);
  });

  // Convert the data array to CSV format
  const csvData = data.map(row => row.join(',')).join('\n');

  // Write the CSV data to a file
  const filename = 'exchange-rates.csv';
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, csvData);

  console.log(`Exchange rates data written to file: ${filename}`);
});

// Define the fetchData function
async function fetchData(url) {
  console.log("Crawling data...")

  // Make an HTTP GET request to the specified URL using Axios
  let response = await axios(url).catch((err) => console.log(err));

  // Handle any errors
  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }

  // Return the response
  return response;
}
