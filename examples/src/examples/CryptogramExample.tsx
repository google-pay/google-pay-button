import React, { useState } from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

export default (props: any) => {
  const [ isReadyToPay, setIsReadyToPay ] = useState(false);

  return (
    <Example title="Cryptogram 3ds">
      <GooglePayButton
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  'gateway': 'stripe',
                  'stripe:version': '2018-10-31',
                  'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '17613812255336763067',
            merchantName: 'Demo Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        onReadyToPayChange={isReady => {
          setIsReadyToPay(isReady);
        }}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        style={{
          display: isReadyToPay ? 'inline-block' : 'none',
        }}
      />
      <div
        style={{
          display: isReadyToPay ? 'none' : 'block',
        }}>No payment methods available</div>
    </Example>
  );
}
