const Crawler = require('crawler');
const fs = require('fs');
const path = require('path');

// Create a new instance of the Crawler with the configuration settings
const crawlerInstance = new Crawler({
  rateLimit: 2000, // Set the rate limit to 2 seconds between requests
  maxConnections: 1, // Set the maximum number of concurrent connections to 1

  // Define the callback function to be executed after each crawl request
  callback: (error, res, done) => {
    if (error) {
      // If an error occurs, log it
      console.log(error);
    } else {
      // Otherwise, extract the relevant data from the response
      const $ = res.$; // Use the Cheerio library to parse the HTML response
      const table = $('table.wikitable.sortable > tbody > tr'); // Find the table containing state capital data
      const data = []; // Create an empty array to store the extracted data

      // Loop through each row of the table
      table.each(function() {
        const cells = $(this).find('td'); // Find all cells in the row
        const state = cells.eq(0).text(); // Extract the state name from the first cell
        const capital = cells.eq(1).text(); // Extract the capital city name from the second cell
        data.push([state, capital]); // Add the state-capital pair to the data array
      });

      // Convert the data array to CSV format
      const csvData = data.map(row => row.join(',')).join('\n');

      // Write the CSV data to a file
      const filename = 'state-capitals.csv';
      const filepath = path.join(__dirname, filename);
      fs.writeFileSync(filepath, csvData);

      // Log a success message indicating that the data has been written to file
      console.log(`State capital data written to file: ${filename}`);
    }
    done(); // Signal that the request is complete
  }
});

// Queue a new request to crawl the state capital data from the Wikipedia page
crawlerInstance.queue({
  uri: 'https://en.wikipedia.org/wiki/List_of_capitals_in_the_United_States',
  callback: function(error, res, done) {
    if (error) {
      // If an error occurs, log it
      console.log(error);
    } else {
      // Otherwise, log a message indicating that the data is being crawled
      console.log("Crawling data...");
    }
    done(); // Signal that the request is complete
  }
});
