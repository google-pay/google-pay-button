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

import React, { useState } from 'react';
import Example from './Example';
import GooglePayButton from '@google-pay/button-react';

export default function CryptogramExample(props: any): React.ReactElement {
  const [isReadyToPay, setIsReadyToPay] = useState(false);

  return (
    <Example title="Cryptogram 3ds">
      <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
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
            totalPrice: props.amount,
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        onReadyToPayChange={result => {
          console.log('ready to pay change', result);
          setIsReadyToPay(result.isReadyToPay);
        }}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        style={{
          display: isReadyToPay ? 'inline-block' : 'none',
        }}
        buttonColor={props.buttonColor}
        buttonType={props.buttonType}
        buttonLocale={props.buttonLocale}
      />
      <div
        style={{
          display: isReadyToPay ? 'none' : 'block',
        }}
      >
        No payment methods available
      </div>
    </Example>
  );
}
