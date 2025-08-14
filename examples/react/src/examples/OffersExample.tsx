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

export default function OffersExample(props: any): React.ReactElement {
  return (
    <Example title='Offers (code: "good")'>
      <GooglePayButton
        environment="TEST"
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
          callbackIntents: ['OFFER'],
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        onPaymentDataChanged={paymentData => {
          const newPaymentData: google.payments.api.PaymentDataRequestUpdate = {
            newTransactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPriceLabel: 'Total',
              totalPrice: props.amount,
              currencyCode: 'USD',
              countryCode: 'US',
            },
          };
          if (paymentData.callbackTrigger === 'OFFER') {
            const goodOffers = paymentData.offerData?.redemptionCodes.filter(code => code === 'good');
            if (goodOffers?.length) {
              newPaymentData.newOfferInfo = {
                offers: Array.from(new Set(goodOffers)).map(offer => ({
                  redemptionCode: offer,
                  description: 'Save 10%',
                })),
              };
              newPaymentData.newTransactionInfo!.totalPrice = (Number(props.amount) * 0.9).toFixed(2);
            }

            const badOffers = paymentData.offerData?.redemptionCodes.filter(code => code !== 'good');
            if (badOffers?.length) {
              newPaymentData.error = {
                reason: 'OFFER_INVALID',
                message: 'Unrecognized promotion code.',
                intent: 'OFFER',
              };
            }
          }
          return newPaymentData;
        }}
        existingPaymentMethodRequired={props.existingPaymentMethodRequired}
        buttonColor={props.buttonColor}
        buttonType={props.buttonType}
        buttonRadius={props.buttonRadius}
        buttonLocale={props.buttonLocale}
        buttonBorderType={props.buttonBorderType}
      />
    </Example>
  );
}
