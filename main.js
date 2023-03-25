const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = "https://www.iban.com/exchange-rates";

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
  const data = [];

  statsTable.each(function () {
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

async function fetchData(url) {
  console.log("Crawling data...")
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}
