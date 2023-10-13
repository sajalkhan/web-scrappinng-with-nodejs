const fs = require("fs");
const json2csv = require("json2csv").parse;

// Define the fields for each type of data
const fields1 = ["name", "price"];
const fields2 = ["productName", "starTechPrice", "ryansPrice", "priceDifference"];

const saveDataToCSV = (data1, data2) => {
  const csv1 = json2csv(data1, { fields: fields1 });
  const csv2 = json2csv(data2, { fields: fields2 });

  // Concatenate the two CSV strings with a newline character in between
  const combinedCSV = `${csv2}\n\n\n${csv1}`;

  // Write the combined data to the CSV file
  fs.writeFileSync("combined_data.tsv", combinedCSV, function (err) {
    if (err) throw err;
  });
};

module.exports = saveDataToCSV;
