This is React component for the Google Pay Button.

## Installation

```sh
npm install --save github:socsieng/react-google-pay-button
```

## Example Usage

```jsx
<GooglePayButton
  merchantInfo={{
    merchantId: '0123456789',
    merchantName: 'Demo Merchant',
  }}
  allowedPaymentMethods={[
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          'gateway': 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        },
      },
    },
  ]}
  transactionInfo={{
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '0',
    currencyCode: 'USD',
    countryCode: 'US',
  }}
  existingPaymentMethodRequired={true}
  onPaymentDataResult={(paymentData) => { console.log('Payment data', paymentData) }}
  />
```
