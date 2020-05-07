import React from 'react';
import loadScript from './load-script';

export type Props = {
  environment?: google.payments.api.Environment,
  existingPaymentMethodRequired?: boolean,
  paymentRequest: google.payments.api.PaymentDataRequest,
  onPaymentDataChanged?: google.payments.api.PaymentDataChangedHandler,
  onPaymentAuthorized?: google.payments.api.PaymentAuthorizedHandler,
  onLoadPaymentData?: (paymentData: google.payments.api.PaymentData) => void,
  onCancel?: (reason: google.payments.api.PaymentsError) => void,
  onError?: (error: Error) => void,
  onReadyToPayChange?: (isReadyToPay: boolean) => void,
  buttonColor?: google.payments.api.ButtonColor,
  buttonType?: google.payments.api.ButtonType,
  className?: string,
  style?: any,
};

type State = {
  isReadyToPay: boolean,
};

export default class GooglePayButton extends React.Component<Props, State> {
  private client?: google.payments.api.PaymentsClient;
  private elementRef: React.RefObject<HTMLDivElement>;
  private componentMounted: boolean;

  constructor(props: Props) {
    super(props);

    this.state = {
      isReadyToPay: false,
    };

    this.elementRef = React.createRef<HTMLDivElement>();
    this.componentMounted = false;
  }

  createClientOptions() {
    const clientConfig: google.payments.api.PaymentOptions = {
      environment: this.props.environment,
    };

    if (this.props.onPaymentDataChanged || this.props.onPaymentAuthorized) {
      clientConfig.paymentDataCallbacks = {};

      if (this.props.onPaymentDataChanged) {
        clientConfig.paymentDataCallbacks.onPaymentDataChanged = (paymentData) => {
          const result = this.props.onPaymentDataChanged!(paymentData);
          return result || {};
        };
      }

      if (this.props.onPaymentAuthorized) {
        clientConfig.paymentDataCallbacks.onPaymentAuthorized = (paymentData) => {
          const result = this.props.onPaymentAuthorized!(paymentData);
          return result || {};
        };
      }
    }

    return clientConfig;
  }

  createIsReadyToPayRequest() {
    const paymentRequest = this.props.paymentRequest;
    const request: google.payments.api.IsReadyToPayRequest = {
      apiVersion: paymentRequest.apiVersion,
      apiVersionMinor: paymentRequest.apiVersionMinor,
      allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
      existingPaymentMethodRequired: this.props.existingPaymentMethodRequired,
    };

    return request;
  }

  createLoadPaymentDataRequest() {
    const request = {
      ...this.props.paymentRequest
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
      if (this.props.onPaymentDataChanged) {
        intents.push('PAYMENT_METHOD');

        if (request.shippingAddressRequired) {
          intents.push('SHIPPING_ADDRESS');
        }

        if (request.shippingOptionRequired) {
          intents.push('SHIPPING_OPTION');
        }
      }

      if (this.props.onPaymentAuthorized) {
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

  private async updateElement(prevProps?: Props) {
    const element = this.elementRef.current;

    if (!element) return;
    if (!this.componentMounted) return;

    // remove children
    Array.from(element.children).forEach(child => child.remove());

    await loadScript('https://pay.google.com/gp/p/js/pay.js');

    if (!this.componentMounted) return;

    this.client = new google.payments.api.PaymentsClient(this.createClientOptions());

    let isReadyToPay = false;

    try {
      const readyToPay = await this.client.isReadyToPay(this.createIsReadyToPayRequest());
      isReadyToPay = readyToPay.result && !this.props.existingPaymentMethodRequired
        || (readyToPay.result && readyToPay.paymentMethodPresent && this.props.existingPaymentMethodRequired)
        || false;
    } catch (err) {
      console.error(err);
    }

    if (!this.componentMounted) return;

    if (isReadyToPay) {
      const button = this.client.createButton({
        buttonType: this.props.buttonType,
        buttonColor: this.props.buttonColor,
        onClick: this.handleClick,
      });
      element.appendChild(button);
    }

    this.setState({ isReadyToPay }, () => {
      if (this.props.onReadyToPayChange) {
        this.props.onReadyToPayChange(isReadyToPay);
      }
    });
  }

  private handleClick = async () => {
    const request = this.createLoadPaymentDataRequest();

    try {
      const result = await this.client!.loadPaymentData(request);

      if (this.props.onLoadPaymentData) {
        this.props.onLoadPaymentData(result);
      }
    } catch (err) {
      if (err.statusCode === 'CANCELED') {
        if (this.props.onCancel) {
          this.props.onCancel(err);
        } else if (this.props.onError) {
          this.props.onError(err);
        }
      }
    }
  };

  private appendStyles() {
    const styleId = 'default-google-style';
    if (!document.getElementById(styleId)) {
      const head = document.querySelector('head');

      if (head) {
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.innerHTML = `
          .google-pay-button-container {
            display: inline-block;
          }
          .google-pay-button-container.fill > div, .google-pay-button-container.fill > div > .gpay-button {
            width: 100%;
            height: inherit;
          }
        `;

        head.appendChild(style);
      }
    }
  }

  componentDidMount() {
    this.componentMounted = true;
    this.appendStyles();
    this.updateElement();
  }

  componentWillUnmount() {
    this.componentMounted = false;
  }

  componentDidUpdate(prevProps: Props) {
    const props = this.props;

    if (props.environment !== prevProps.environment
        || props.existingPaymentMethodRequired !== prevProps.existingPaymentMethodRequired) {
      this.updateElement();
    }
  }

  render() {
    return (
      <div
        ref={this.elementRef}
        className={['google-pay-button-container', this.props.className].filter(c => c).join(' ')}
        style={this.props.style}
      />
    );
  }
}
