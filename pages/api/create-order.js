import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const ticketId = uuidv4();

    await axios({
      method: "post",
      url: "https://svngddunt0.execute-api.eu-west-2.amazonaws.com/tick/ticket",
      headers: {},
      data: {
        ticketId: ticketId,
        eventId: req.body.eventId,
        event: req.body.event,
        ticketClass: req.body.ticketClass,
        owner: req.body.email,
      },
    });
    res.status(200).send("hello");
  }

  // SEND EMAIL
  //
  // if (req.method === "POST") {
  //   await axios({
  //     method: "post",
  //     url: "https://ljjqu2ki77.execute-api.eu-west-2.amazonaws.com/default/RougeLambdaSES",
  //     headers: {},
  //     data: {
  //       recipent: req.body.email,
  //       mess: req.body.event, // This is the body part
  //     },
  //   });
  //   res.status(200).send("hello");
  // }
}
