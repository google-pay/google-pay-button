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

import './__mocks__';
import { ButtonManager, Config } from './button-manager';
import defaults from './__setup__/defaults';

describe('Apply default configuration', () => {
  it('maintains default request parameters', async () => {
    const manager = new ButtonManager('google-pay-button');

    const request = manager.createLoadPaymentDataRequest({
      ...defaults,
    });

    expect(request.shippingAddressRequired).toBe(undefined);
    expect(request.shippingOptionRequired).toBe(undefined);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(undefined);
  });

  it('sets default required parameters when options are supplied', async () => {
    const manager = new ButtonManager('google-pay-button');

    const request = manager.createLoadPaymentDataRequest({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressParameters: {
          phoneNumberRequired: false,
          allowedCountryCodes: [],
        },
        shippingOptionParameters: {
          shippingOptions: [],
        },
        allowedPaymentMethods: [
          {
            ...defaults.paymentRequest.allowedPaymentMethods[0],
            parameters: {
              ...defaults.paymentRequest.allowedPaymentMethods[0].parameters,
              billingAddressParameters: {
                format: 'MIN',
              },
            },
          },
        ],
      },
    });

    expect(request.shippingAddressRequired).toBe(true);
    expect(request.shippingOptionRequired).toBe(true);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(true);
  });

  it('does not override required parameters when options are supplied', async () => {
    const manager = new ButtonManager('google-pay-button');

    const request = manager.createLoadPaymentDataRequest({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: false,
        shippingAddressParameters: {
          phoneNumberRequired: false,
          allowedCountryCodes: [],
        },
        shippingOptionRequired: false,
        shippingOptionParameters: {
          shippingOptions: [],
        },
        allowedPaymentMethods: [
          {
            ...defaults.paymentRequest.allowedPaymentMethods[0],
            parameters: {
              ...defaults.paymentRequest.allowedPaymentMethods[0].parameters,
              billingAddressRequired: false,
              billingAddressParameters: {
                format: 'MIN',
              },
            },
          },
        ],
      },
    });

    expect(request.shippingAddressRequired).toBe(false);
    expect(request.shippingOptionRequired).toBe(false);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(false);
  });
});

describe('Callbacks', () => {
  it('maintains default callback values', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: false,
        shippingAddressParameters: {
          phoneNumberRequired: false,
          allowedCountryCodes: [],
        },
        shippingOptionRequired: false,
        shippingOptionParameters: {
          shippingOptions: [],
        },
        allowedPaymentMethods: [
          {
            ...defaults.paymentRequest.allowedPaymentMethods[0],
            parameters: {
              ...defaults.paymentRequest.allowedPaymentMethods[0].parameters,
              billingAddressRequired: false,
              billingAddressParameters: {
                format: 'MIN',
              },
            },
          },
        ],
      },
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks).toBe(undefined);
    expect(request.callbackIntents).toBe(undefined);
  });

  it('does not override callbacks when already set', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: true,
        shippingOptionRequired: true,
        callbackIntents: [],
      },
      onPaymentDataChanged: () => ({}),
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).not.toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');
  });

  it('populates callbacks when onPaymentDataChanged is set', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      onPaymentDataChanged: () => ({}),
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');
  });

  it('populates callbacks when onPaymentDataChanged and shippingAddressRequired is set', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: true,
      },
      onPaymentDataChanged: () => ({}),
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');
  });

  it('populates callbacks when onPaymentDataChanged and shippingOptionRequired is set', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingOptionRequired: true,
      },
      onPaymentDataChanged: () => ({}),
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');
  });

  it('populates callbacks when onPaymentAuthorized is set', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config: Config = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };

    const options = manager.createClientOptions(config);
    const request = manager.createLoadPaymentDataRequest(config);

    expect(options.paymentDataCallbacks?.onPaymentAuthorized).toBeTruthy();
    expect(request.callbackIntents).not.toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).toContain('PAYMENT_AUTHORIZATION');
  });
});

describe('Google Pay client invalidation', () => {
  it('invalidates client when environment changes', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      environment: 'TEST',
    };
    const config2: Config = {
      ...defaults,
      environment: 'PRODUCTION',
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when existingPaymentMethodRequired changes', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      existingPaymentMethodRequired: false,
    };
    const config2: Config = {
      ...defaults,
      existingPaymentMethodRequired: true,
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when onPaymentDataChanged added', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
    };
    const config2: Config = {
      ...defaults,
      onPaymentDataChanged: () => ({}),
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when onPaymentDataChanged removed', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      onPaymentDataChanged: () => ({}),
    };
    const config2: Config = {
      ...defaults,
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when onPaymentAuthorized added', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
    };
    const config2: Config = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when onPaymentAuthorized removed', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };
    const config2: Config = {
      ...defaults,
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('does not invalidate client when onPaymentAuthorized modified', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };
    const config2: Config = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'ERROR' }),
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(false);
  });

  it('does not invalidate client transactionInfoChannges', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
    };
    const config2: Config = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        transactionInfo: {
          ...defaults.paymentRequest.transactionInfo,
          totalPrice: '200.00',
        },
      },
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(false);
  });

  it('invalidates client when buttonType changes', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      buttonType: 'long',
    };
    const config2: Config = {
      ...defaults,
      buttonType: 'short',
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });

  it('invalidates client when buttonColor changes', async () => {
    const manager = new ButtonManager('google-pay-button');
    const config1: Config = {
      ...defaults,
      buttonColor: 'default',
    };
    const config2: Config = {
      ...defaults,
      buttonColor: 'white',
    };

    const invalidated = manager.isClientInvalidated(config1, config2);

    expect(invalidated).toBe(true);
  });
});
