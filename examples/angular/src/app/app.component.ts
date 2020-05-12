import { Component } from '@angular/core';
import '@google-pay-button/web-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  amount = '100.00';
  buttonType = 'long';
  buttonColor = 'default';
  existingPaymentMethodRequired = false;

  paymentRequest = {
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
  };

  onLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
    console.log('load payment data', paymentData);
  };

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = paymentData => {
    console.log('payment authorized', paymentData);

    return {
      transactionState: 'SUCCESS',
    };
  };
}
