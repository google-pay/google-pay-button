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

const paymentRequest: google.payments.api.PaymentDataRequest = {
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
          gateway: 'example',
          gatewayMerchantId: 'exampleGatewayMerchantId',
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
    totalPrice: '12.00',
    currencyCode: 'USD',
    countryCode: 'US',
    displayItems: [
      {
        label: 'Subtotal',
        type: 'SUBTOTAL',
        price: '11.00',
      },
      {
        label: 'Tax',
        type: 'TAX',
        price: '1.00',
      },
      {
        label: 'Shipping',
        type: 'LINE_ITEM',
        price: '0',
        status: 'PENDING',
      },
    ],
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
  shippingOptionRequired: true,
  callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
};

export default function DynamicPriceUpdateExample(props: any): React.ReactElement {
  return (
    <Example title="Dynamic Price Updates">
      <GooglePayButton
        environment="TEST"
        paymentRequest={paymentRequest}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        onPaymentDataChanged={paymentData => {
          const shippingOption = shippingOptions.find(o => o.id === paymentData.shippingOptionData?.id);
          const { displayItems } = paymentRequest.transactionInfo;
          if (displayItems) {
            const shippingItem = displayItems.find((i: any) => i.label === 'Shipping');
            if (shippingItem && shippingOption) {
              shippingItem.price = shippingOption.price;
              shippingItem.status = 'FINAL';

              console.log('display items', displayItems);
              return {
                newTransactionInfo: {
                  ...paymentRequest.transactionInfo,
                  displayItems: displayItems,
                  totalPrice: displayItems.reduce((sum: number, i: any) => sum + parseFloat(i.price), 0).toFixed(2),
                },
              };
            }
          }
          return {};
        }}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        buttonColor={props.buttonColor}
        buttonType={props.buttonType}
        buttonLocale={props.buttonLocale}
      />
    </Example>
  );
}
