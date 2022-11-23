export async function getEvent(eventName) {
  const res = await fetch(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event?eventName=${eventName}`);
  const data = await res.json();
    return data;
}

export default async function handler(req, res) {
  const events = await fetch(`https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event?eventName=${eventName}`);
  res.status(200).json(events.data);
}


