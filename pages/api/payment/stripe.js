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

  const body = req.body;
  const payment_intent_id = body.payment_intent_id;
  const type = body.type;
  const amount = body.totalPrice ? body.totalPrice * 100: null;

  // Fetch data by payment id
  if (payment_intent_id) {
    try {
      // If a payment_intent_id is passed, retrieve the paymentIntent
      const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
      if(type === "checkStatus") {
        if(current_intent) {
          res.status(200).json({
            status: "success",
            paymentStatus: current_intent.status,
            metadata: current_intent.metadata || {}
          });
        } else {
          res.status(201).json({
            status: "fail",
            paymentStatus: "fail",
            metadata: {}
          });
        }

        return;
      }


      // If a paymentIntent is retrieved update its amount
      if (current_intent & amount) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          { amount }
        );
        // res.status(200).json(updated_intent);
        res.status(200).json({
          clientSecret: updated_intent.client_secret,
          id: updated_intent.id
        });
        return;
      }
    } catch (e) {
      //Catch any error and return a status 500
      if (e.code !== 'resource_missing') {
        const errorMessage =
          e instanceof Error ? e.message : 'Internal server error';
        res.status(500).json({ statusCode: 500, message: errorMessage });
        return;
      }
    }
  }
  
  try {
    // Create PaymentIntent
    const params = {
      amount: amount,
      currency: "SEK",
      description: body.event,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        eventName: body.event,
        eventId: body.eventId,
        ticketClass: body.ticketClass,
        quantity: body.quantity,
        totalPrice: body.totalPrice,
        email: body.email,
      },
    
    };
    const paymentIntent = await stripe.paymentIntents.create(params);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};

export default handler;