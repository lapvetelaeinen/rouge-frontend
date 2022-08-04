const puppeteer = require("puppeteer");
const fs = require("fs-extra");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent("<h1>hello</h1>");
    await page.emulateMediaType("screen");
    await page.pdf({
      path: "mypdf.pdf",
      format: "A4",
      printBackground: true,
    });

    console.log("done");
    await browser.close();
    process.exit();
  }
}
