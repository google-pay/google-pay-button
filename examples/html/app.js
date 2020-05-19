/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import GooglePayButton from './node_modules/@google-pay/button-element/dist/index.js';

class ControlAccessor {
  constructor(id) {
    this.id = id;
  }

  get control() {
    return document.getElementById(this.id);
  }

  get value() {
    return this.control.value;
  }
}

const controls = {
  amount: new ControlAccessor('amount'),
  existingPaymentRequired: new ControlAccessor('existing-payment-method-required'),
  buttonColor: new ControlAccessor('button-color'),
  buttonType: new ControlAccessor('button-type'),
};

const defaultPaymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
        billingAddressParameters: {
          format: 'MIN',
        },
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
    totalPrice: '100.00',
    currencyCode: 'USD',
    countryCode: 'US',
  },
};

function onLoadPaymentData(paymentData) {
  console.log('load payment data', paymentData);
}

// eslint-disable-next-line no-unused-vars
function onPaymentAuthorized(paymentData) {
  return {
    transactionState: 'SUCCESS',
  };
}

const googlePayButtons = [
  {
    title: 'Basic Example',
    get props() {
      return {
        buttonColor: controls.buttonColor.value,
        buttonType: controls.buttonType.value,
        paymentRequest: {
          ...defaultPaymentRequest,
          transactionInfo: {
            ...defaultPaymentRequest.transactionInfo,
            totalPrice: controls.amount.value,
          },
        },
        existingPaymentRequired: controls.existingPaymentRequired.value === 'true',
        onLoadPaymentData,
      };
    },
  },
  {
    title: 'Cryptogram 3ds',
    get props() {
      return {
        buttonColor: controls.buttonColor.value,
        buttonType: controls.buttonType.value,
        paymentRequest: {
          ...defaultPaymentRequest,
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
                },
              },
            },
          ],
          transactionInfo: {
            ...defaultPaymentRequest.transactionInfo,
            totalPrice: controls.amount.value,
          },
        },
        existingPaymentRequired: controls.existingPaymentRequired.value === 'true',
        onLoadPaymentData,
        onPaymentAuthorized,
      };
    },
  },
  {
    title: 'Payment Authorization',
    get props() {
      return {
        buttonColor: controls.buttonColor.value,
        buttonType: controls.buttonType.value,
        paymentRequest: {
          ...defaultPaymentRequest,
          transactionInfo: {
            ...defaultPaymentRequest.transactionInfo,
            totalPrice: controls.amount.value,
          },
        },
        existingPaymentRequired: controls.existingPaymentRequired.value === 'true',
        onLoadPaymentData,
        onPaymentAuthorized,
      };
    },
  },
  {
    title: 'Require Shipping',
    get props() {
      return {
        buttonColor: controls.buttonColor.value,
        buttonType: controls.buttonType.value,
        paymentRequest: {
          ...defaultPaymentRequest,
          transactionInfo: {
            ...defaultPaymentRequest.transactionInfo,
            totalPrice: controls.amount.value,
          },
        },
        existingPaymentRequired: controls.existingPaymentRequired.value === 'true',
        shippingAddressRequired: true,
        onLoadPaymentData,
        onPaymentAuthorized,
      };
    },
  },
];

window.controls = controls;

function initializeControls() {
  for (const props of Object.values(controls)) {
    props.control.addEventListener('change', () => {
      updateGooglePayButtons();
    });
  }
}

function updateGooglePayButtons() {
  let index = 0;
  for (const gpay of googlePayButtons) {
    const id = `button${index}`;
    let button = document.getElementById(id);

    if (!button) {
      button = new GooglePayButton();
      button.id = id;

      const container = document.getElementById('examples');
      container.appendChild(createExample(gpay.title, button));
    }

    Object.assign(button, gpay.props);
    index++;
  }
}

function createExample(text, button) {
  const example = document.createElement('div');
  example.className = 'example';
  const title = document.createElement('div');
  title.className = 'title';
  const demo = document.createElement('div');
  demo.className = 'demo';

  title.innerText = text;

  demo.appendChild(button);

  example.appendChild(title);
  example.appendChild(demo);

  return example;
}

initializeControls();
updateGooglePayButtons();

// create the button
const staticButton = document.getElementById('static');

staticButton.paymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
        billingAddressParameters: {
          format: 'MIN',
        },
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
    totalPrice: '100.00',
    currencyCode: 'USD',
    countryCode: 'US',
  },
};
staticButton.onLoadPaymentData = onLoadPaymentData;
