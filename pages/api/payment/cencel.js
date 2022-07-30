import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
});
const handler = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method Not Allowed")
        return
    }

    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
        res.status(400).json({ statusCode: 400, message: "Invalid payment id" });
    }
    try {
        // If a paymentIntentId is passed, retrieve the paymentIntent
        const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
        if(paymentIntent.status === "canceled") {
            res.status(200).json({ status: "success",  message: "Payment canceled" });
        } else {
            res.status(201).json({ status: "fail", message: "Payment not cancel" });
        }
        return;
    } catch (e) {
        //Catch any error and return a status 500
        if (e.code !== "resource_missing") {
            const errorMessage =
                e instanceof Error ? e.message : "Internal server error";
            res.status(500).json({ statusCode: 500, message: errorMessage });
            return;
        }
    }
};

export default handler;