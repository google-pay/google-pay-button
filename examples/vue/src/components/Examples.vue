<!--
 Copyright 2020 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<template>
  <div class="examples">
    <div class="params">
      <label>
        <span>Default amount:</span>
        <input type="text" v-model="amount" />
      </label>
      <label>
        <span>Payment method required:</span>
        <select v-model="existingPaymentMethodRequired">
          <option v-bind:value="false">No</option>
          <option v-bind:value="true">Yes</option>
        </select>
      </label>
      <label>
        <span>Button color:</span>
        <select v-model="buttonColor">
          <option value="default">default</option>
          <option value="black">black</option>
          <option value="white">white</option>
        </select>
      </label>
      <label>
        <span>Button type:</span>
        <select v-model="buttonType">
          <option value="buy">buy</option>
          <option value="plain">plain</option>
          <option value="donate">donate</option>
          <option value="long">long</option>
          <option value="short">short</option>
        </select>
      </label>
    </div>

    <div>
      <div class="example">
        <div class="title">Basic Example</div>
        <div class="demo">
          <google-pay-button
            environment="TEST"
            v-bind:button-type="buttonType"
            v-bind:button-color="buttonColor"
            v-bind:existing-payment-method-required="existingPaymentMethodRequired"
            v-bind:paymentRequest.prop="{
              apiVersion: paymentRequest.apiVersion,
              apiVersionMinor: paymentRequest.apiVersionMinor,
              allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
              merchantInfo: paymentRequest.merchantInfo,
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: amount,
                currencyCode: 'USD',
                countryCode: 'US',
              },
            }"
            v-on:loadpaymentdata="onLoadPaymentData"
            v-on:error="onError"
          ></google-pay-button>
        </div>
      </div>
      <div class="example">
        <div class="title">Payment Authorization</div>
        <div class="demo">
          <google-pay-button
            environment="TEST"
            v-bind:button-type="buttonType"
            v-bind:button-color="buttonColor"
            v-bind:existing-payment-method-required="existingPaymentMethodRequired"
            v-bind:paymentRequest.prop="{
              apiVersion: paymentRequest.apiVersion,
              apiVersionMinor: paymentRequest.apiVersionMinor,
              allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
              merchantInfo: paymentRequest.merchantInfo,
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: amount,
                currencyCode: 'USD',
                countryCode: 'US',
              },
            }"
            v-on:loadpaymentdata="onLoadPaymentData"
            v-on:error="onError"
            v-bind:onPaymentAuthorized.prop="onPaymentDataAuthorized"
          ></google-pay-button>
        </div>
      </div>
      <div class="example">
        <div class="title">Cryptogram 3ds</div>
        <div class="demo">
          <google-pay-button
            environment="TEST"
            v-bind:button-type="buttonType"
            v-bind:button-color="buttonColor"
            v-bind:existing-payment-method-required="existingPaymentMethodRequired"
            v-bind:paymentRequest.prop="{
              apiVersion: paymentRequest.apiVersion,
              apiVersionMinor: paymentRequest.apiVersionMinor,
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
              merchantInfo: paymentRequest.merchantInfo,
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: amount,
                currencyCode: 'USD',
                countryCode: 'US',
              },
              callbackIntents: ['PAYMENT_AUTHORIZATION'],
            }"
            v-on:loadpaymentdata="onLoadPaymentData"
            v-on:error="onError"
            v-bind:onPaymentAuthorized.prop="onPaymentDataAuthorized"
          ></google-pay-button>
        </div>
      </div>
      <div class="example">
        <div class="title">Require Shipping</div>
        <div class="demo">
          <google-pay-button
            environment="TEST"
            v-bind:button-type="buttonType"
            v-bind:button-color="buttonColor"
            v-bind:existing-payment-method-required="existingPaymentMethodRequired"
            v-bind:paymentRequest.prop="{
              apiVersion: paymentRequest.apiVersion,
              apiVersionMinor: paymentRequest.apiVersionMinor,
              allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
              merchantInfo: paymentRequest.merchantInfo,
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: amount,
                currencyCode: 'USD',
                countryCode: 'US',
              },
              shippingAddressRequired: true,
              callbackIntents: ['PAYMENT_AUTHORIZATION'],
            }"
            v-on:loadpaymentdata="onLoadPaymentData"
            v-on:error="onError"
            v-on:readytopaychange="onReadyToPayChange"
            v-bind:onPaymentAuthorized.prop="onPaymentDataAuthorized"
          ></google-pay-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@google-pay/button-element';

export default {
  name: 'Examples',
  props: {},
  data: () => ({
    amount: '100.00',
    existingPaymentMethodRequired: false,
    buttonColor: 'default',
    buttonType: 'buy',
    paymentRequest: {
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
    },
  }),
  methods: {
    onLoadPaymentData: event => {
      console.log('load payment data', event.detail);
    },
    onError: event => {
      console.error('error', event.error);
    },
    onPaymentDataAuthorized: paymentData => {
      console.log('payment authorized', paymentData);

      return {
        transactionState: 'SUCCESS',
      };
    },
    onReadyToPayChange: event => {
      console.log('ready to pay change', event.detail);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.params {
  padding: 5px;
  background-color: #fff;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.params > label {
  margin: 5px 10px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  width: 150px;
}

.params > label > * {
  display: block;
}

.params > label > span {
  margin-bottom: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.params > label > input,
.params > label > select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 4px;
  border: 1px solid #999;
  background-color: #fff;
  border-radius: 0;
  color: #000;
}

.example {
  margin: 5px;
  display: flex;
  flex-direction: row;
}

.example > .title {
  width: 250px;
  align-items: center;
  display: inherit;
}

.example > .demo {
  flex: 1 0 0;
}

.example > .demo > * {
  margin: 1px;
}
</style>
