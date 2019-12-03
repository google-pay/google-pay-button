import React from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

const allowedPaymentMethods = [
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

function onPaymentDataResult (paymentRequest: any) {
  console.log('Success', paymentRequest);
}

export default (props: any) => {
  return (
    <Example title="Button Style">
      <GooglePayButton
        allowedPaymentMethods={allowedPaymentMethods}
        merchantInfo={merchantInfo}
        transactionInfo={{
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: props.amount,
          currencyCode: 'USD',
          countryCode: 'US',
        }}
        onPaymentDataResult={onPaymentDataResult}
        style={{
          width: '40%',
          height: 80,
        }}
      />

      <GooglePayButton
        allowedPaymentMethods={allowedPaymentMethods}
        merchantInfo={merchantInfo}
        transactionInfo={{
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: props.amount,
          currencyCode: 'USD',
          countryCode: 'US',
        }}
        onPaymentDataResult={onPaymentDataResult}
        style={{
          height: 70,
        }}
      />

      <GooglePayButton
        allowedPaymentMethods={allowedPaymentMethods}
        merchantInfo={merchantInfo}
        transactionInfo={{
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: props.amount,
          currencyCode: 'USD',
          countryCode: 'US',
        }}
        onPaymentDataResult={onPaymentDataResult}
        style={{
          width: 200,
        }}
      />
    </Example>
  );
}
