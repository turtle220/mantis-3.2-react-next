import React, { useEffect, useRef, useState } from "react";
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import axios from 'utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';

import CardSection from "./CardSection";

const CheckoutForm = ({ stripe, elements }) => {
    const productPriceRef = useRef(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (productPriceRef.current) {
            console.log('Product Price Class:', productPriceRef.current.className);
            setAmount(productPriceRef.current.className)
        }
    }, [productPriceRef]);

    const handleSubmit = async event => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
        });


        if (error) {
            console.log(error.message);
        } else {
            // PaymentMethod object contains paymentMethodId

            try {
                const paymentMethodId = paymentMethod.id;
                const response = await axios.post('http://localhost:4000/api/checkout-product', {
                    amount: 999,
                    paymentMethodId: paymentMethodId,
                    currency: 'usd'
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast("Payment Successful");
                console.log(response.data);
            } catch (e) {
                const errorMessage = e?.response.data.message;
                throw new Error(errorMessage);
            }

            // Handle further actions such as sending paymentMethodId to your server
        }
    };


    return (
        <div>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <CardSection />
                {/* <Button disabled={!stripe} variant="contained" sx={{ textTransform: 'none', mt: 3 }}>
                    Buy Now
                </Button> */}
                <button disabled={!stripe} className="btn-pay">
                    Buy Now
                </button>
            </form>
        </div>
    );
}

export default function InjectedCheckoutForm() {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <CheckoutForm stripe={stripe} elements={elements} />
            )}
        </ElementsConsumer>
    );
}