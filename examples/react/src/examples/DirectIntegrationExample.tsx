import React from 'react';
import Example from './Example';
import GooglePayButton from '@google-pay/button-react';

export default (props: any) => {
  return (
    <Example title="Direct Integration">
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
                type: 'DIRECT',
                parameters: {
                  'protocolVersion': 'ECv2',
                  'publicKey': 'BMzk6xvwPgU8vjB6O/HnFFkMQL/w17yIoKy/6KuRYjOrh0eV12xM6guaYPHdgMHyUzTm9/Vi7KRu4tuRmhm6nv8=',
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
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        buttonColor={props.buttonColor}
        buttonType={props.buttonType}
      />
    </Example>
  );
}
