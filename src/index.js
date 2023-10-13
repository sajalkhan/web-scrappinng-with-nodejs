const express = require("express");
const saveDataToCSV = require("./utils/createCsv.js");
const scrapeProducts = require("./utils/scrap-product");
const findMatchingProducts = require("./utils/findMatchingProduct.js");
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
    const [starTechProducts, ryansProducts] = await Promise.all([getData(starTechUrl, starTech.laptop), getData(ryansUrl, ryans.laptop)]);

    const comparedProducts = findMatchingProducts(starTechProducts, ryansProducts);

    saveDataToCSV(starTechProducts, comparedProducts);
  } catch (error) {
    console.error(error);
  }
};

app.listen(port, async () => {
  await getWebProductInfo();
  console.log(`Server is listening on port ${port}`);
});
