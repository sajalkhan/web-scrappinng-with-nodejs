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
    const ryansProducts = await getData(ryansUrl, ryans.laptop);
    const starTechProducts = await getData(starTechUrl, starTech.laptop);

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
