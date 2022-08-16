import axios from "axios";
const puppeteer = require("puppeteer");
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export default async function handler(req, res) {
  // if (req.method === "POST") {
  //   const ticketId = uuidv4();

  //   const thisQRCode = await QRCode.toDataURL(ticketId);

  //   await axios({
  //     method: "post",
  //     url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
  //     headers: {},
  //     data: {
  //       ticketId: ticketId,
  //       eventId: req.body.eventId,
  //       qrCode: thisQRCode.toString(),
  //       event: req.body.event,
  //       ticketClass: req.body.ticketClass,
  //       owner: req.body.email,
  //     },
  //   });

  //   res.status(200).send("hello");
  // }

  // SEND EMAIL
  //
  if (req.method === "POST") {
    const ticketId = uuidv4();

    await axios({
      method: "post",
      url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
      headers: {},
      data: {
        ticketId: ticketId,
        eventId: req.body.eventId,
        event: req.body.eventName,
        ticketClass: req.body.ticketClass,
        owner: req.body.email,
        used: false,
      },
    });

    //     const QR = await QRCode.toDataURL(ticketId);
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.setContent(`<html>
    //   <head>
    //     <style>
    //       html {height: 100%;}
    //       body {background-color: powderblue; height: 100%;} h1 {color: blue;} p {color: red;}
    //       .image-box {width: 100vw; height: 100%; display: flex; justify-content: center; align-items: center;}
    //       img {width: 80%;}
    //     </style>
    //   </head>
    //   <body>
    // <div class="image-box"><img src="${QR}"></img></div>

    //   </body>
    // </html>`);
    //     await page.emulateMediaType("screen");
    //     const pdf = await page.pdf({
    //       format: "A4",
    //       printBackground: true,
    //     });

    //     await browser.close();

    await axios({
      method: "post",
      url: "https://aw2406aj4d.execute-api.eu-west-2.amazonaws.com/pup/puppy",
      headers: {},
      data: JSON.stringify({
        recipent: "filip.lapvetelainen@gmail.com",
        ticketId: ticketId,
        eventName: "lalalla",
      }),
    });
    res.status(200).send("hello");
  }
}
