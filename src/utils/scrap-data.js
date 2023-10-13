const axios = require("axios");
const cheerio = require("cheerio");
const axiosRetry = require("axios-retry");

axiosRetry(axios, { retries: 3 });

const getText = ($, element, selector) => {
  return $(element)
    .find(selector)
    .text()
    .replace(/\b[Tt]k? |[\/\n\",.৳]/g, "")
    .trim();
};

async function scrapeProductList(url, rest) {
  try {
    const response = await axios
      .get(url)
      .then(response => response)
      .catch(error => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 503) {
            console.log("Service is temporarily unavailable. Please try again later.");
          } else {
            console.log(error.message);
          }
        }
      });

    const $ = cheerio.load(response.data);
    const { targetItem, itemName, itemPrice } = rest;

    // Extract the product list
    const products = $(targetItem)
      .map((_i, element) => {
        const name = getText($, element, itemName);
        const price = getText($, element, itemPrice);
        return { name, price };
      })
      .get();

    // Sort the products by name in ascending order
    const sortedProducts = products.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );

    return sortedProducts;
  } catch (error) {
    // Handle the error here.
    console.log(error);
    return [];
  }
}

module.exports = scrapeProductList;
