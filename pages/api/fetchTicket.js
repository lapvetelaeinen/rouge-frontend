export async function getTicket(eventName, orderId) {
    const response = await fetch(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/fetch-ticket?eventName=${eventName}&orderId=${orderId}`);
    const jsonData = await response.json();
    return jsonData
}

export default async function handler(req, res) {
  const events = await axios.get("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/fetch-ticket?eventName=25-nov-lov1-löning&orderId=02457CE88A714025B912271EF889E16C");
  res.status(200).json(events.data);
}
