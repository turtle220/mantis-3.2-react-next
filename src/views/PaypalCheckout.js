import { CLIENT_ID } from '../config';
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalCheckout = () => {
  // const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [ErrorMessage, setErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);

  // creates a paypal order
  const createOrder = (actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Sunflower',
            amount: {
              currency_code: 'USD',
              value: 20
            }
          }
        ]
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  // check Approval
  const onApprove = (actions) => {
    return actions.order.capture().then(function () {
      // const { payer } = details;
      setSuccess(true);
    });
  };

  //capture likely error
  // const onError = (data, actions) => {
  //     setErrorMessage("An Error occured with your payment ");
  // };

  useEffect(() => {
    if (success) {
      alert('Payment successful!!');
      console.log('Order successful . Your order id is--', orderID);
    }
  }, [success]);

  return (
    <PayPalScriptProvider options={{ 'client-id': CLIENT_ID }}>
      <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};

export default PaypalCheckout;
