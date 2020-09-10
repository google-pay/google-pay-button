<script lang="ts">
  import '@google-pay/button-element';

  let amount = '100.00';
  let existingPaymentMethodRequired = false;
  let buttonColor = 'default';
  let buttonType = 'buy';

  function buildPaymentRequest(): google.payments.api.PaymentDataRequest {
    return {
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
        totalPrice: amount,
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };
  }

  let paymentRequests: { [key: string]: google.payments.api.PaymentDataRequest };

  function updatePaymentRequests() {
    paymentRequests = {
      basic: buildPaymentRequest(),
      authorize: {
        ...buildPaymentRequest(),
        callbackIntents: ['PAYMENT_AUTHORIZATION'],
      },
      cryptogram: {
        ...buildPaymentRequest(),
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
      },
      shipping: {
        ...buildPaymentRequest(),
        shippingAddressRequired: true,
        callbackIntents: ['PAYMENT_AUTHORIZATION'],
      },
    };
  }

  function onLoadPaymentData(event) {
    console.log('load payment data', event.detail);
  }

  function onError(event) {
    console.error('error', event.error);
  }

  function onPaymentDataAuthorized(paymentData) {
    console.log('payment authorized', paymentData);

    return {
      transactionState: 'SUCCESS',
    };
  }

  function onReadyToPayChange(event) {
    console.log('ready to pay change', event.detail);
  }

  function handleAmountChange() {
    updatePaymentRequests();
  }

  updatePaymentRequests();
</script>

<style>
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

<main>
  <div class="params">
    <label>
      <span>Default amount:</span>
      <input type="text" bind:value={amount} on:change={handleAmountChange} />
    </label>
    <label>
      <span>Payment method required:</span>
      <select id="existingPaymentMethodRequired" bind:value={existingPaymentMethodRequired}>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
    </label>
    <label>
      <span>Button color:</span>
      <select id="button-color" bind:value={buttonColor}>
        <option value="default">default</option>
        <option value="black">black</option>
        <option value="white">white</option>
      </select>
    </label>
    <label>
      <span>Button type:</span>
      <select id="button-type" bind:value={buttonType}>
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
          button-type={buttonType}
          button-color={buttonColor}
          {existingPaymentMethodRequired}
          paymentRequest={paymentRequests.basic}
          on:loadpaymentdata={onLoadPaymentData}
          on:error={onError} />
      </div>
    </div>
    <div class="example">
      <div class="title">Payment Authorization</div>
      <div class="demo">
        <google-pay-button
          environment="TEST"
          button-type={buttonType}
          button-color={buttonColor}
          {existingPaymentMethodRequired}
          paymentRequest={paymentRequests.authorize}
          on:loadpaymentdata={onLoadPaymentData}
          on:error={onError}
          onPaymentAuthorized={onPaymentDataAuthorized} />
      </div>
    </div>
    <div class="example">
      <div class="title">Cryptogram 3ds</div>
      <div class="demo">
        <google-pay-button
          environment="TEST"
          button-type={buttonType}
          button-color={buttonColor}
          {existingPaymentMethodRequired}
          paymentRequest={paymentRequests.cryptogram}
          on:loadpaymentdata={onLoadPaymentData}
          on:error={onError}
          onPaymentAuthorized={onPaymentDataAuthorized} />
      </div>
    </div>
    <div class="example">
      <div class="title">Require Shipping</div>
      <div class="demo">
        <google-pay-button
          environment="TEST"
          button-type={buttonType}
          button-color={buttonColor}
          {existingPaymentMethodRequired}
          paymentRequest={paymentRequests.shipping}
          on:loadpaymentdata={onLoadPaymentData}
          on:error={onError}
          on:readytopaychange={onReadyToPayChange}
          onPaymentAuthorized={onPaymentDataAuthorized} />
      </div>
    </div>
  </div>
</main>
