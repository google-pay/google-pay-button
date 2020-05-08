# Google Pay React Component

This is the React component for the Google Pay Button.

## Installation

```sh
npm install --save react-google-pay-button
```

## Example Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import GooglePayButton from 'react-google-pay-button';

const App = () => (
  <GooglePayButton
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
              gateway: 'gateway name',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '100.00',
        currencyCode: 'USD',
        countryCode: 'US',
      },
    }}
    onLoadPaymentData={paymentRequest => {
      console.log('Success', paymentRequest);
    }}
  />
);

ReactDOM.render(<App />, document.getElementById('root'));
```

More examples can be found in the [examples folder](./examples/src/examples) of this repository.
