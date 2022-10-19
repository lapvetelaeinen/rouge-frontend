import axios from "axios";
const puppeteer = require("puppeteer");
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export default async function handler(req, res) {
  let thisDate = new Date();

  const newDate = thisDate.toISOString().split("T")[0];

  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  const url =
    "https://mcogg5h829.execute-api.eu-west-2.amazonaws.com/tickt/ticket";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ticketId: req.body.ticketId,
    }),
  };
  const data = await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("RESPONSE FROM API: ", data);
      if (data) {
        console.log("THIS IS TEH DATA::::: ", data);
        return data;
      }
    });

  if (data) {
    return;
  }

  if (req.method === "POST") {
    await axios({
      method: "post",
      url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
      headers: {},
      data: {
        ticketId: req.body.ticketId,
        eventId: req.body.eventId,
        eventName: req.body.eventName,
        purchaseDate: newDate,
        amount: req.body.totalPrice,
        ticketClass: req.body.ticketClass,
        owner: req.body.email,
        randomNumber: randomNumber,
        used: false,
        paymentStatus: "PAID",
      },
    });

    console.log("!!!!!!PASSED SECURITY!!!!");

    await axios({
      method: "post",
      url: "https://aw2406aj4d.execute-api.eu-west-2.amazonaws.com/pup/puppy",
      headers: {},
      data: JSON.stringify({
        recipent: req.body.email,
        ticketId: req.body.ticketId,
        eventName: req.body.eventName,
        ticketClass: req.body.ticketClass,
        randomNumber: randomNumber,
      }),
    });
    res.status(200).send("hello");
  }
}
