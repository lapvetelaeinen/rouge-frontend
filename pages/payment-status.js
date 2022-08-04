import { useEffect, useState } from "react";
import StripePaymentStatus from '../components/payment/stripe/paymentStatus'
import SwishPaymentStatus from '../components/payment/swish/paymentStatus'

const PaymentStatus = () => {
    const [stripePaymentId, setStripePaymentId] = useState()
    const [swishPaymentId, setSwishPaymentId] = useState()

    useEffect(() => {
        const url = new URLSearchParams(window.location.search)
        const payment_intent_id = url.get("payment_intent");
        const swish_pay_id = url.get("swish_pay_id");
        setStripePaymentId(payment_intent_id || null)
        setSwishPaymentId(swish_pay_id || null)
    }, [])

    return (
        <div>
            { stripePaymentId && <StripePaymentStatus paymentId={stripePaymentId} /> }
            { swishPaymentId && <SwishPaymentStatus paymentId={swishPaymentId} /> }
        </div>
    );
}

export default PaymentStatus;
