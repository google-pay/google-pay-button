import React from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

export default (props: any) => {
  return (
    <Example title="Production Gateway">
      <GooglePayButton
        environment="PRODUCTION"
        allowedPaymentMethods={[
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
                'stripe:publishableKey': 'pk_live_u4W1tkj5FEHBipLTfqrBYJyp',
              },
            },
          },
        ]}
        merchantInfo={{
          merchantId: '17613812255336763067',
          merchantName: 'Demo Merchant',
        }}
        transactionInfo={{
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: props.amount,
          currencyCode: 'USD',
          countryCode: 'US',
        }}
        onPaymentDataResult={(paymentRequest: any) => {
          console.log('Success', paymentRequest);
        }}
      />
    </Example>
  );
}
