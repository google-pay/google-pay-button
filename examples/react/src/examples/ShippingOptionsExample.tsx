import React from 'react';
import Example from './Example';
import GooglePayButton from '@google-pay/button-react';

const shippingOptions = [
  {
    id: 'free',
    label: 'Free shipping',
    description: 'Arrives in 5 to 7 days',
    price: '0.00',
  },
  {
    id: 'express',
    label: 'Express shipping',
    description: '$5.00 - Arrives in 1 to 3 days',
    price: '5.00',
  },
];

export default (props: any) => {
  return (
    <Example title="Shipping Options">
      <GooglePayButton
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
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
          shippingAddressRequired: true,
          shippingOptionParameters: {
            defaultSelectedOptionId: 'free',
            shippingOptions: shippingOptions.map(o => ({
              id: o.id,
              label: o.label,
              description: o.description,
            })),
          },
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        buttonColor={props.buttonColor}
        buttonType={props.buttonType}
      />
    </Example>
  );
}
