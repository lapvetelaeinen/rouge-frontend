import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from '../../../styles/payment.module.css'
import Times from "../../svg/Times";

const SwishPayment = (props) => {
    const [token, setToken] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [qrCodeImage, setQrCodeImage] = useState('');
    const [error, setError] = useState('');
    const [paymentAppLink, setPaymentAppLink] = useState('');
    const [callbackUrl, setCallbackUrl] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setLoader] = useState(false);

    const checkDevice = () => {
        setIsMobile(false)
        if (navigator && navigator.userAgent && (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/iPhone/i))) {
            setIsMobile(true)
        }
    }

    const setAppPaymentLink = () => {
        let payLink = ""
        let cbUrl = ""
        if (token && paymentId) {
            const origin = window.location.origin || 'http://localhost:3000'
            cbUrl = `${origin}/payment-status?swish_pay_id=${paymentId}`;
            console.log(">> Check payment status Link: ", cbUrl)
            const appUrl = `swish://paymentrequest?token=${token}&callbackurl=${cbUrl}`;
            payLink = appUrl
        }
        setPaymentAppLink(payLink)
        setCallbackUrl(cbUrl)
    }

    const getQrCode = async (paymentToken) => {
        if (qrCodeImage) {
            setQrCodeImage('')
        }

        setLoader(true);
        await fetch("/api/payment/swish", {
            method: "POST",
            body: JSON.stringify({
                token: paymentToken,
                type: "getQrCode"
            }),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(res => {
            if (res.status !== 200) {
                throw new Error("Invalid respose try gain after some time")
            }
            return res;
        })
            .then(res => res.blob())
            .then(blob => {
                setQrCodeImage(URL.createObjectURL(blob))
                return true;
            })
            .catch(error => {
                console.log(error)
                setError(error.message)
            });
        setLoader(false);
    }

    const handleCreatePaymentRequest = async () => {
        setError('')
        setToken('')
        setPaymentId('')
        setQrCodeImage('')
        setLoader(true);

        const result = await fetch("/api/payment/swish", {
            method: "POST",
            body: JSON.stringify({
                ...props.order,
                type: "paymentrequests"
            }),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(res => res.json())
            .catch(error => {
                console.log(error)
                setError(error.message)
                setLoader(false);
                return false;
            });
        console.log(">>result> SIWSH: ", result)
        if (result && result.token) {
            setToken(result.token)
            setPaymentId(result.id)
            return;
        }
        if (result.message) {
            setError(result.message)
        }
        setLoader(false);
    }

    useEffect(() => {
        checkDevice()
        handleCreatePaymentRequest()
    }, [])

    useEffect(() => {
        if (token) {
            getQrCode(token)
        }
        setAppPaymentLink()
    }, [token, paymentId])

    const handleCancel = () => {
        if (props.onCancel) {
            props.onCancel()
        }
    }

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
                    {
                        isLoading &&
                        <h1 className={`text-2xl bold mb-4 ${styles.paymentTitle}`}>
                            Loading...
                        </h1>
                    }
                    {
                        qrCodeImage &&
                        <div className={styles.paymentImgWrapper}>
                            <Image
                                src={qrCodeImage}
                                alt="QR code"
                                height={300}
                                width={300}
                                className={styles.paymentImg}
                            />
                        </div>
                    }
                    {
                        (callbackUrl) &&
                        <div className={styles.paymentStatusLinkBlock}>
                            <p className={styles.paymentStautsLinkInfo}>Klicka på knappen när du betalat i Swish-appen</p>
                            <a href={callbackUrl} className={styles.paymentLink} target="_blank" rel="noreferrer">Betalat</a>
                        </div>
                    }
                    {
                        (isMobile && paymentAppLink) &&
                        <div className={styles.paymentLinkBlock}>
                            <p className={styles.paymentLinkInfo}>Go to app and pay</p>
                            <a href={paymentAppLink} className={styles.paymentLink} target="_blank" rel="noreferrer">Pay using app</a>
                        </div>
                    }
                    {error && <div className={`${styles.paymentError} ml-4`}>{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default SwishPayment;
