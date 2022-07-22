export default async function handler(req, res) {
  if (req.method !== "POST") {
    res
      .status(400)
      .json({ error: "Invalid HTTP method. Only POST requests are allowed." });
  }

  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const body = req.body;
    if (!body) {
      res.status(400).send("Bad request (no body)");
      return;
    }

    const slugToRevalidate = body.slugToRevalidate;
    if (slugToRevalidate) {
      await res.revalidate(`/event/${slugToRevalidate}`);
      return res.json({ revalidated: true });
    }
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
