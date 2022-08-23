import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await axios({
      method: "post",
      url: "https://vi35lyfbyc.execute-api.eu-west-2.amazonaws.com/bookin/book",
      headers: {},
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        desc: req.body.desc,
        date: req.body.date,
      },
    });
    res.status(200).send("hello");
  }
}
