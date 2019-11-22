import React, { useState } from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

export default (props: any) => {
  const [ isReadyToPay, setIsReadyToPay ] = useState(false);

  return (
    <Example title="American Express (existing payment methods only)">
      { isReadyToPay
        ? <GooglePayButton
            allowedPaymentMethods={[
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['AMEX'],
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
            onReadyToPayChange={(isReady: boolean) => {
              setIsReadyToPay(isReady);
            }}
            existingPaymentMethodRequired={true}
          />
          : <div>No AMEX payment methods available</div>
        }
    </Example>
  );
}
