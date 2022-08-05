import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkoutForm';
import styles from '../../../styles/payment.module.css'
import Times from "../../svg/Times";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = (props) => {
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntent, setPaymentIntent] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setError('')
        fetch('/api/payment/stripe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(props.order),
        }).then((res) => res.json())
        .then((data) => {
            setClientSecret(data.clientSecret);
            setPaymentIntent(data.id);
        }).catch(error => {
            console.log(">> ERROR: ", error)
            setError('Something wrong try agin after some time')
        });
    }, []);

    const handleCancel = async () => {

        if (paymentIntent) {
            await fetch('/api/payment/cencel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId: paymentIntent
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(">> Cancel payment", data)
                    if (data.status === "success") {
                        // Success
                    } else {
                        // Fail
                    }

                }).catch((error) => {
                    console.log("ERROR: ", error.message)
                });
        }


        if (props.onCancel) {
            props.onCancel()
        }
    }

    const appearance = {
        theme: 'stripe',
        labels: 'floating',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className={`bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-start bg-opacity-80 ${styles.paymentWrapper}`}>
            <div className={`bg-neutral-200 w-full min-h-[700px] m-4 rounded-3xl ${styles.paymentModal}`}>
                <div className="flex flex-col">
                    <div className={styles.stripePaymentCancel}>
                        <Times
                            width={35}
                            height={35}
                            fill="#f57971"
                            onClick={handleCancel}
                        />
                    </div>
                    <h1 className={`text-2xl bold mb-4 ${styles.paymentTitle}`}>
                        Payment
                    </h1>
                    {clientSecret && (
                        <Elements options={options} stripe={stripe}>
                            <CheckoutForm paymentIntent={paymentIntent} />
                        </Elements>
                    )}
                    {error && <div className={`${styles.paymentError} ml-4`}>{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default StripePayment;
