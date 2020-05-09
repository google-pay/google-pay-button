import loadScript from '../lib/load-script';

export interface Config {
  environment?: google.payments.api.Environment;
  existingPaymentMethodRequired?: boolean;
  paymentRequest: google.payments.api.PaymentDataRequest;
  onPaymentDataChanged?: google.payments.api.PaymentDataChangedHandler;
  onPaymentAuthorized?: google.payments.api.PaymentAuthorizedHandler;
  onLoadPaymentData?: (paymentData: google.payments.api.PaymentData) => void;
  onCancel?: (reason: google.payments.api.PaymentsError) => void;
  onError?: (error: Error) => void;
  onReadyToPayChange?: (isReadyToPay: boolean) => void;
  buttonColor?: google.payments.api.ButtonColor;
  buttonType?: google.payments.api.ButtonType;
}

export class ButtonManager {
  private client?: google.payments.api.PaymentsClient;
  private config?: Config;
  private element?: HTMLElement;
  private selector: string;

  isReadyToPay?: boolean;

  constructor(selector: string) {
    this.selector = selector;
  }

  getElement() {
    return this.element;
  }

  mount(element: HTMLElement) {
    this.element = element;
    if (element) {
      this.appendStyles();
      if (this.config) {
        this.updateElement();
      }
    }
  }

  unmount() {
    this.element = undefined;
  }

  configure(newConfig: Config) {
    const oldConfig = this.config;
    this.config = newConfig;
    if (!oldConfig || this.isClientInvalidated(oldConfig, newConfig)) {
      this.updateElement();
    }
  }

  createClientOptions(config: Config) {
    const clientConfig: google.payments.api.PaymentOptions = {
      environment: config.environment,
    };

    if (config.onPaymentDataChanged || config.onPaymentAuthorized) {
      clientConfig.paymentDataCallbacks = {};

      if (config.onPaymentDataChanged) {
        clientConfig.paymentDataCallbacks.onPaymentDataChanged = (paymentData) => {
          const result = config.onPaymentDataChanged!(paymentData);
          return result || {};
        };
      }

      if (config.onPaymentAuthorized) {
        clientConfig.paymentDataCallbacks.onPaymentAuthorized = (paymentData) => {
          const result = config.onPaymentAuthorized!(paymentData);
          return result || {};
        };
      }
    }

    return clientConfig;
  }

  createIsReadyToPayRequest(config: Config) {
    const paymentRequest = config.paymentRequest;
    const request: google.payments.api.IsReadyToPayRequest = {
      apiVersion: paymentRequest.apiVersion,
      apiVersionMinor: paymentRequest.apiVersionMinor,
      allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
      existingPaymentMethodRequired: config.existingPaymentMethodRequired,
    };

    return request;
  }

  createLoadPaymentDataRequest(config: Config) {
    const request = {
      ...config.paymentRequest
    };

    // infer shippingAddressRequired
    if (request.shippingAddressParameters && request.shippingAddressRequired === undefined) {
      request.shippingAddressRequired = true;
    }

    // infer shippingOptionRequired
    if (request.shippingOptionParameters && request.shippingOptionRequired === undefined) {
      request.shippingOptionRequired = true;
    }

    // infer callback intents if not set
    if (!request.callbackIntents) {
      const intents: google.payments.api.CallbackIntent[] = [];
      if (config.onPaymentDataChanged) {
        intents.push('PAYMENT_METHOD');

        if (request.shippingAddressRequired) {
          intents.push('SHIPPING_ADDRESS');
        }

        if (request.shippingOptionRequired) {
          intents.push('SHIPPING_OPTION');
        }
      }

      if (config.onPaymentAuthorized) {
        intents.push('PAYMENT_AUTHORIZATION');
      }

      if (intents.length) {
        request.callbackIntents = intents;
      }
    }

    // infer billingAddressRequired
    request.allowedPaymentMethods = request.allowedPaymentMethods.map(pm => {
      const paymentMethod = {
        ...pm,
        parameters: {
          ...pm.parameters,
        }
      };

      if (paymentMethod.parameters.billingAddressParameters
          && paymentMethod.parameters.billingAddressRequired === undefined) {
        paymentMethod.parameters.billingAddressRequired = true;
      }

      return paymentMethod;
    });

    return request;
  }

  private isMounted() {
    return this.element != null && this.element.isConnected !== false;
  }

  private async updateElement() {
    if (!this.isMounted()) return;
    const element = this.element!;
    
    if (!this.config) {
      throw Error('google-pay-button: Missing configuration');
    }

    // remove children
    element.textContent = '';

    await loadScript('https://pay.google.com/gp/p/js/pay.js');

    if (!this.isMounted()) return;

    this.client = new google.payments.api.PaymentsClient(this.createClientOptions(this.config));

    let isReadyToPay = false;

    try {
      const readyToPay = await this.client.isReadyToPay(this.createIsReadyToPayRequest(this.config));
      isReadyToPay = readyToPay.result && !this.config.existingPaymentMethodRequired
        || (readyToPay.result && readyToPay.paymentMethodPresent && this.config.existingPaymentMethodRequired)
        || false;
    } catch (err) {
      console.error(err);
    }

    if (!this.isMounted()) return;

    if (isReadyToPay) {
      const button = this.client.createButton({
        buttonType: this.config.buttonType,
        buttonColor: this.config.buttonColor,
        onClick: this.handleClick,
      });
      element.appendChild(button);
    }

    if (this.isReadyToPay !== isReadyToPay) {
      this.isReadyToPay = isReadyToPay;
      if (this.config.onReadyToPayChange) {
        this.config.onReadyToPayChange(isReadyToPay);
      }
    }
  }

  private handleClick = async () => {
    const config = this.config;
    if (!config) {
      throw Error('google-pay-button: Missing configuration')
    }

    const request = this.createLoadPaymentDataRequest(config);

    try {
      const result = await this.client!.loadPaymentData(request);

      if (config.onLoadPaymentData) {
        config.onLoadPaymentData(result);
      }
    } catch (err) {
      if (err.statusCode === 'CANCELED') {
        if (config.onCancel) {
          config.onCancel(err);
        } else if (config.onError) {
          config.onError(err);
        }
      }
    }
  };

  private appendStyles() {
    const styleId = `default-google-style-${this.selector.replace(/\./g, '')}`;

    // initialize styles if rendering on the client:
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.type = 'text/css';
      style.innerHTML = `
        ${this.selector} {
          display: inline-block;
        }
        ${this.selector}.fill > div,
        ${this.selector}.fill > div > .gpay-button {
          width: 100%;
          height: inherit;
        }
      `;

      document.head.appendChild(style);
    }
  }

  isClientInvalidated(oldConfig: Config, newConfig: Config) {
    return (
      oldConfig.environment !== newConfig.environment
      || oldConfig.existingPaymentMethodRequired !== newConfig.existingPaymentMethodRequired
      || !!oldConfig.onPaymentDataChanged !== !!newConfig.onPaymentDataChanged
      || !!oldConfig.onPaymentAuthorized !== !!newConfig.onPaymentAuthorized
      || oldConfig.buttonColor !== newConfig.buttonColor
      || oldConfig.buttonType !== newConfig.buttonType
    );
  }
}
