import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await axios({
      method: "post",
      url: "https://ljjqu2ki77.execute-api.eu-west-2.amazonaws.com/default/RougeLambdaSES",
      headers: {},
      data: {
        recipent: req.body.email,
        mess: req.body.event, // This is the body part
      },
    });
  }
}
