import React from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

const allowedPaymentMethods: google.payments.api.PaymentMethodSpecification[] = [
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
];

const merchantInfo = {
  merchantId: '17613812255336763067',
  merchantName: 'Demo Merchant',
};

function onLoadPaymentData(paymentRequest: any) {
  console.log('Success', paymentRequest);
}

export default (props: any) => {
  return (
    <Example title="Button Appearance">
      <GooglePayButton
        buttonType="short"
        buttonColor="black"
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods,
          merchantInfo,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={onLoadPaymentData}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
      />

      <GooglePayButton
        buttonType="long"
        buttonColor="black"
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods,
          merchantInfo,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={onLoadPaymentData}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
      />

      <GooglePayButton
        buttonType="short"
        buttonColor="white"
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods,
          merchantInfo,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={onLoadPaymentData}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
      />

      <GooglePayButton
        buttonType="long"
        buttonColor="white"
        environment={props.environment}
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods,
          merchantInfo,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={onLoadPaymentData}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
      />
    </Example>
  );
}
