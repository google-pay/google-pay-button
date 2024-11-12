/**
 * Copyright 2024 Google LLC
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

//=============================================================================
// Configuration
//=============================================================================

// The DOM element that the Google Pay button will be rendered into
const GPAY_BUTTON_CONTAINER_ID = 'gpay-container';

// Update the `merchantId` and `merchantName` properties with your own values.
// These fields are optional when the environment is `TEST`.
const merchantInfo = {
  merchantId: '12345678901234567890',
  merchantName: 'Example Merchant',
};

/**
 * This is the base configuration for all Google Pay requests. This
 * configuration will be cloned, modified, and used for all Google Pay requests.
 *
 * @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects}
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway}
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#MerchantInfo}
 */
const baseGooglePayRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
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
  merchantInfo,
};

// Prevent accidental edits to the base configuration. Mutations will be
// handled by cloning the config using deepCopy() and modifying the copy.
Object.freeze(baseGooglePayRequest);

//=============================================================================
// Google payments client singleton
//=============================================================================

/**
 * A variable to store the Google Payments Client instance.
 * Initialized to null to indicate it hasn't been created yet.
 */
let paymentsClient = null;

/**
 * Gets an instance of the Google Payments Client.
 *
 * This function ensures that only one instance of the Google Payments Client
 * is created and reused throughout the application. It lazily initializes
 * the client if it hasn't been created yet.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient}
 * @return {google.payments.api.PaymentsClient} Google Payments Client instance.
 */
function getGooglePaymentsClient() {
  // Check if the paymentsClient has already been initialized.
  if (paymentsClient === null) {
    // If not, create a new instance of the Google Payments Client.
    paymentsClient = new google.payments.api.PaymentsClient({
      // Set the environment for the client ('TEST' or 'PRODUCTION').
      // `TEST` is default.
      environment: 'TEST',
      // Add the merchant information (optional)
      merchantInfo,
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
        onPaymentDataChanged: onPaymentDataChanged,
      },
    });
  }

  return paymentsClient;
}

//=============================================================================
// Helpers
//=============================================================================

/**
 * Creates a deep copy of an object.
 *
 * This function uses JSON serialization and deserialization to create a deep
 * copy of the provided object. It's a convenient way to clone objects without
 * worrying about shared references.
 *
 * @param {Object} obj - The object to be copied.
 * @returns {Object} A deep copy of the original object.
 */
const deepCopy = obj => JSON.parse(JSON.stringify(obj));

/**
 * Renders the Google Pay button to the DOM.
 *
 * This function creates a Google Pay button using the Google Pay API and adds
 * it to the container element specified by `GPAY_BUTTON_CONTAINER_ID`.
 * When clicked, button triggers the `onGooglePaymentButtonClicked` handler.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#createButton}
 * @returns {void}
 */
function renderGooglePayButton() {
  // Create a Google Pay button using the PaymentsClient.
  const button = getGooglePaymentsClient().createButton({
    // Set the click handler for the button to the onGooglePaymentButtonClicked
    onClick: onGooglePaymentButtonClicked,
    // Set the allowed payment methods for the button.
    allowedPaymentMethods: baseGooglePayRequest.allowedPaymentMethods,
  });
  // Add the Google Pay button to the container element on the page.
  document.getElementById(GPAY_BUTTON_CONTAINER_ID).appendChild(button);
}

/**
 * Prefetches Google Pay payment data to improve the payment flow performance.
 *
 * This function creates a payment data request object and uses the Google Pay client
 * to prefetch payment data. This can help speed up the payment process when the user
 * actually initiates a transaction. The prefetched data is cached and can be used
 * for subsequent payment requests.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo}
 * @returns {void}
 */
function prefetchGooglePaymentData() {
  // Create a deep copy of the base Google Pay request object.
  // This ensures that the original request object is not modified.
  const req = deepCopy(baseGooglePayRequest);

  // Set the transactionInfo property on the request object.
  // This is required for prefetching, even though the values
  // are not used for caching.
  req.transactionInfo = {
    totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
    currencyCode: 'USD',
  };

  // Get an instance of the Google Pay client and use it to
  // prefetch the payment data.
  getGooglePaymentsClient().prefetchPaymentData(req);
}

//=============================================================================
// Event Handlers
//=============================================================================

/**
 * Google Pay API loaded handler
 *
 * This function will be called by the script tag in index.html when the pay.js
 * script has finished loading. Once the script is loaded, it will first check
 * to see if the consumer is ready to pay with Google Pay. If they are ready,
 * the next thing it does is add the Google Pay button to the page. Otherwise,
 * it logs an error to the console.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#isReadyToPay}
 * @returns {void}
 */
function onGooglePayLoaded() {
  // Create a deep copy of the base Google Pay request object.
  // This ensures that any modifications made to the request object
  // do not affect the original base request.
  const req = deepCopy(baseGooglePayRequest);

  // Get an instance of the Google Payments Client.
  getGooglePaymentsClient()
    // Check if the user is ready to pay with Google Pay.
    .isReadyToPay(req)
    // Handle the response from the isReadyToPay() method.
    .then(function (res) {
      // If the user is ready to pay with Google Pay...
      if (res.result) {
        // Render the Google Pay button to the page.
        renderGooglePayButton();
        // Prefetch the payment data to improve performance.
        prefetchGooglePaymentData();
      } else {
        // If the user is not ready to pay with Google Pay, log
        // an error to the console.
        console.log('Google Pay is not ready for this user.');
      }
    })
    // Handle any errors that occur during the process.
    .catch(console.error);
}

/**
 * Google Pay button click handler
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#loadPaymentData}
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentMethodTokenizationData}
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo}
 * @returns {void}
 */
function onGooglePaymentButtonClicked() {
  // Create a new request data object for this request
  const req = {
    ...deepCopy(baseGooglePayRequest),
    transactionInfo: {
      countryCode: 'US',
      currencyCode: 'USD',
      totalPriceStatus: 'FINAL',
      totalPrice: (Math.random() * 999 + 1).toFixed(2),
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'OFFER'],
    shippingAddressRequired: true,
    shippingOptionRequired: true,
    shippingOptionParameters: {
      defaultSelectedOptionId: 'shipping-001',
      shippingOptions: [
        {
          id: 'shipping-001',
          label: '$0.00: Free shipping',
          description: 'Free Shipping delivered in 5 business days.',
        },
        {
          id: 'shipping-002',
          label: '$1.99: Standard shipping',
          description: 'Standard shipping delivered in 3 business days.',
        },
        {
          id: 'shipping-003',
          label: '$1000: Express shipping',
          description: 'Express shipping delivered in 1 business day.',
        },
      ],
    },
  };

  // Write the data to console for debugging
  console.log('onGooglePaymentButtonClicked', req);

  // Get an instance of the Google Payments Client.
  getGooglePaymentsClient()
    // Load the payment data in console for the transaction.
    .loadPaymentData(req)
    // If the payment is successful, process the payment
    .then(function (res) {
      // show returned data for debugging
      console.log(res);
      // @todo pass payment token to your gateway to process payment
      // @note DO NOT save the payment credentials for future transactions,
      // unless they're used for merchant-initiated transactions with user
      // consent in place.
      paymentToken = res.paymentMethodData.tokenizationData.token;
    })
    // If there is an error, log it to the console.
    .catch(console.error);
}

function onPaymentAuthorized(paymentData) {
  return new Promise(function (resolve, reject) {
    // Write the data to console for debugging
    console.log('onPaymentAuthorized', paymentData);

    // Do something here to pass token to your gateway

    // To simulate the payment processing, there is a 70% chance of success
    const paymentAuthorizationResult =
      Math.random() > 0.3
        ? { transactionState: 'SUCCESS' }
        : {
            transactionState: 'ERROR',
            error: {
              intent: 'PAYMENT_AUTHORIZATION',
              message: 'Insufficient funds',
              reason: 'PAYMENT_DATA_INVALID',
            },
          };

    resolve(paymentAuthorizationResult);
  });
}

function onPaymentDataChanged(intermediatePaymentData) {
  return new Promise(function (resolve, reject) {
    let paymentDataRequestUpdate = {};

    // Write the data to console for debugging
    console.log('onPaymentDataChanged', intermediatePaymentData);

    switch (intermediatePaymentData.callbackTrigger) {
      case 'INITIALIZE':
        // Handle initialize
        break;
      case 'SHIPPING_ADDRESS':
        // Read intermediatePaymentData.transactionInfo
        // Read intermediatePaymentData.shippingAddress
        // Update paymentDataRequestUpdate.newTransactionInfo
        break;
      case 'SHIPPING_OPTION':
        // Read intermediatePaymentData.transactionInfo
        // Read intermediatePaymentData.shippingOptionData
        // Update paymentDataRequestUpdate.newTransactionInfo
        // Update paymentDataRequestUpdate.newShippingOptionParameters
        break;
      case 'OFFER':
        // Read intermediatePaymentData.offerData
        // Read intermediatePaymentData.transactionInfo
        // Update paymentDataRequestUpdate.newTransactionInfo
        // Update paymentDataRequestUpdate.newOfferInfo
        break;
      default:
      // Update paymentDataRequestUpdate.error
    }

    resolve(paymentDataRequestUpdate);
  });
}
