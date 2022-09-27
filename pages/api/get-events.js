import { RolesAnywhere } from "aws-sdk";
import * as uuid from "uuid";
import dynamoDb from "../../lib/dynamo-db";
import axios from "axios";

export default async function handler(req, res) {
  const events = await axios.get("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events");
  res.status(200).json(events.data);
}
