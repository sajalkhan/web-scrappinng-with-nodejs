const express = require("express");
const saveDataToCSV = require("./utils/createCsv.js");
const scrapeProducts = require("./utils/scrap-product");
const stringSimilarity = require("string-similarity");
const { starTech, ryans, starTechUrl, ryansUrl } = require("./resource/config.json");

const app = express();
const port = 3000;

const getData = async (url, config) => {
  const products = await scrapeProducts(url + config.api, {
    page: config.page,
    targetItem: config.targetItem,
    itemName: config.itemName,
    itemPrice: config.itemPrice,
  });

  return products;
};

const getWebProductInfo = async () => {
  try {
    // Use Promise.all to make multiple concurrent requests
    const [starTechProductsResponse, ryansProductsResponse] = await Promise.all([
      getData(starTechUrl, starTech.laptop),
      getData(ryansUrl, ryans.laptop),
    ]);

    // Access the data property of the response objects
    const starTechProducts = starTechProductsResponse;
    const ryansProducts = ryansProductsResponse;

    const comparedProducts = [];

    // Iterate through starTech products
    starTechProducts.forEach(starTechProduct => {
      // Find the best matching product in ryans based on a fuzzy string comparison
      const { bestMatchIndex } = stringSimilarity.findBestMatch(
        starTechProduct.name,
        ryansProducts.map(ryansProduct => ryansProduct.name),
      );

      // Extract the best match from ryans
      const ryansProduct = ryansProducts[bestMatchIndex];

      // If a matching product is found in ryans, compare their prices
      if (ryansProduct) {
        const priceDifference = parseInt(starTechProduct.price) - parseInt(ryansProduct.price);

        if (priceDifference && priceDifference >= 0 && priceDifference < 3000) {
          const product = {
            productName: starTechProduct.name,
            starTechPrice: starTechProduct.price,
            ryansPrice: ryansProduct.price,
            priceDifference,
          };

          comparedProducts.push(product);
        }
      }
    });

    saveDataToCSV(starTechProducts, comparedProducts);
  } catch (error) {
    console.error(error);
  }
};

app.listen(port, async () => {
  await getWebProductInfo();
  console.log(`Server is listening on port ${port}`);
});
