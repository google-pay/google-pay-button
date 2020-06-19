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

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mock implementation of the Google Pay PaymentsClient for testing purposes.
 */
class PaymentsClient {
  isReadyToPay(request: google.payments.api.IsReadyToPayRequest): Promise<google.payments.api.IsReadyToPayResponse> {
    return Promise.resolve({
      result: true,
      paymentMethodPresent: true,
    });
  }

  loadPaymentData(request: google.payments.api.PaymentDataRequest): Promise<google.payments.api.PaymentData> {
    return Promise.resolve({
      apiVersion: request.apiVersion,
      apiVersionMinor: request.apiVersionMinor,
      paymentMethodData: {
        type: 'CARD',
        tokenizationData: {
          type: 'PAYMENT_GATEWAY',
          token: 'token',
        },
      },
    });
  }

  createButton(request: google.payments.api.ButtonOptions): HTMLElement {
    return document.createElement('div');
  }

  prefetchPaymentData(request: google.payments.api.PaymentDataRequest): void {}
}

window.google = {
  payments: {
    api: {
      PaymentsClient,
    },
  },
};
