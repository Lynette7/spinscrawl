const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = "https://en.wikipedia.org/wiki/List_of_capitals_in_the_United_States";

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const table = $('table.wikitable.sortable > tbody > tr');
  const data = [];

  table.each(function () {
    const cells = $(this).find('td');
    const state = cells.eq(0).text();
    const capital = cells.eq(1).text();
    data.push([state, capital]);
  });

  // Convert the data array to CSV format
  const csvData = data.map(row => row.join(',')).join('\n');

  // Write the CSV data to a file
  const filename = 'state-capitals.csv';
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, csvData);

  console.log(`State capital data written to file: ${filename}`);
});

async function fetchData(url) {
  console.log("Crawling data...")
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}
