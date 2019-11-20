import React from 'react';
import loadScript from './load-script';

interface BasePaymentRequest {
  apiVersion: number,
  apiVersionMinor: number,
  merchantInfo: any,
  allowedPaymentMethods: google.payments.api.BasePaymentMethod[],
};

interface PaymentRequest extends BasePaymentRequest {
  emailRequired?: boolean,
  existingPaymentMethodRequired?: boolean,
  shippingAddressRequired?: boolean,
  shippingAddressParameters?: google.payments.api.ShippingAddressParameters,
  shippingOptionRequired?: boolean,
  shippingOptionParameters?: ShippingOptionParameters,
  transactionInfo: google.payments.api.TransactionInfo,
  callbackIntents?: string[],
}

interface ShippingOption {
  id: string,
  label: string,
  description: string,
}

interface ShippingOptionParameters {
  defaultSelectedOptionId: string,
  shippingOptions: ShippingOption[],
}

interface PaymentsClientConfig {
  environment: Environment,
  paymentDataCallbacks?: Record<string, Function>,
}

type Environment = 'TEST' | 'PRODUCTION';

type Props = {
  environment: Environment,
  version: {
    major: number,
    minor: number,
  },
  emailRequired?: boolean,
  existingPaymentMethodRequired?: boolean,
  merchantInfo: {
    merchantId?: string,
    merchantName?: string,
  },
  allowedPaymentMethods: google.payments.api.BasePaymentMethod[],
  shippingAddressRequired?: boolean,
  shippingAddressParameters?: google.payments.api.ShippingAddressParameters,
  shippingOptionParameters?: ShippingOptionParameters,
  onPaymentDataChanged?: Function,
  onPaymentAuthorized?: Function,
  onPaymentDataResult?: Function,
  onCancel?: Function,
  onError?: Function,
  onReadyToPayChange?: Function,
  appearance: {
    buttonColor?: 'default' | 'black' | 'white',
    buttonType?: 'long' | 'short',
    width?: string | number,
    height?: string | number,
  },
  transactionInfo: google.payments.api.TransactionInfo,
};

type State ={
  isReadyToPay: boolean,
};

function getCssUnit(value: any): string {
  return typeof value === 'number' ? `${value}px` : `${value}`;
}

export default class GooglePayButton extends React.Component<Props, State> {
  static defaultProps = {
    environment: 'TEST',
    version: {
      major: 2,
      minor: 0,
    },
    emailRequired: false,
    existingPaymentMethodRequired: false,
    shippingAddressRequired: false,
    appearance: {
      buttonColor: 'default',
      buttonType: 'long',
    },
  };

  private baseRequest: BasePaymentRequest;
  private container: React.RefObject<HTMLDivElement>;
  private paymentRequest?: PaymentRequest;
  private client?: google.payments.api.PaymentsClient;

  constructor(props: Props) {
    super(props);

    this.state = {
      isReadyToPay: false,
    };

    this.baseRequest = {
      apiVersion: this.props.version.major,
      apiVersionMinor: this.props.version.minor,
      merchantInfo: this.props.merchantInfo,
      allowedPaymentMethods: this.props.allowedPaymentMethods,
    };

    this.container = React.createRef();
    this.handleClick = this.handleClick.bind(this);
  }

  buildPaymentRequest(): PaymentRequest {
    const paymentRequest: PaymentRequest = {
      ...this.baseRequest,
      emailRequired: this.props.emailRequired,
      transactionInfo: this.props.transactionInfo,
      shippingAddressRequired: this.props.shippingAddressRequired,
      shippingAddressParameters: this.props.shippingAddressParameters,
    };
    const callbackIntents = [];

    if (this.props.onPaymentDataChanged) {
      callbackIntents.push('SHIPPING_ADDRESS');
  
      if (this.props.shippingOptionParameters) {
        callbackIntents.push('SHIPPING_OPTION');
      }
    }
  
    if (this.props.onPaymentAuthorized) {
      callbackIntents.push('PAYMENT_AUTHORIZATION');
    }

    if (callbackIntents.length) {
      paymentRequest.callbackIntents = callbackIntents;
    }

    if (this.props.shippingOptionParameters) {
      paymentRequest.shippingOptionParameters = this.props.shippingOptionParameters;
      paymentRequest.shippingOptionRequired = true;
    }

    const transactionInfo = paymentRequest.transactionInfo as google.payments.api.FinalPriceTransactionInfo;
    const { displayItems } = transactionInfo;
    if (displayItems && !transactionInfo.totalPrice) {
      const total = displayItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
      transactionInfo.totalPrice = total.toFixed(2);
    }

    return paymentRequest;
  }

  async handleClick() {
    const paymentRequest = this.buildPaymentRequest();
    this.paymentRequest = paymentRequest;

    this.client!.loadPaymentData(paymentRequest as unknown as google.payments.api.PaymentDataRequest)
      .then(paymentResponse => {
        if (this.props.onPaymentDataResult) {
          this.props.onPaymentDataResult(paymentResponse);
        }
      })
      .catch(error => {
        if (error.statusCode === 'CANCELED' && this.props.onCancel) {
          this.props.onCancel(error);
        } else if (this.props.onError) {
          this.props.onError(error);
        }
        console.log('Error', { error, paymentRequest });
      });
  }

  async componentDidMount() {
    await loadScript('https://pay.google.com/gp/p/js/pay.js');
    const google = window.google;

    const { environment, onPaymentDataChanged, onPaymentAuthorized, onReadyToPayChange, existingPaymentMethodRequired, appearance } = this.props
    const clientConfig: PaymentsClientConfig = {
      environment: environment,
    };
  
    if (onPaymentDataChanged || onPaymentAuthorized) {
      clientConfig.paymentDataCallbacks = {};

      if (onPaymentDataChanged) {
        clientConfig.paymentDataCallbacks.onPaymentDataChanged = (...args: any[]) => {
          const result = onPaymentDataChanged(...args, this.paymentRequest);
          return result || {};
        };
      }
    
      if (onPaymentAuthorized) {
        clientConfig.paymentDataCallbacks.onPaymentAuthorized = (...args: any[]) => {
          const result = onPaymentAuthorized(...args, this.paymentRequest);
          return result || {};
        }
      }
    }
  
    this.client = new google.payments.api.PaymentsClient(clientConfig);
    const readyToPayResponse = await this.client.isReadyToPay(this.baseRequest as unknown as google.payments.api.IsReadyToPayRequest);
    let isReadyToPay = false;

    if ((existingPaymentMethodRequired && readyToPayResponse.paymentMethodPresent && readyToPayResponse.result)
      || (!existingPaymentMethodRequired && readyToPayResponse.result)) {
      const button = this.client.createButton({
        buttonColor: appearance.buttonColor,
        buttonType: appearance.buttonType,
        onClick: this.handleClick,
      });

      if (appearance.width || appearance.height) {
        const style: any = {};
        const gPayButton = button.querySelector('button');
        if (gPayButton) {
          if (appearance.width) {
            style.width = '100%';
          }
          if (appearance.height) {
            style.height = getCssUnit(appearance.height);
          }

          Object.assign(gPayButton.style, style);
        }
      }

      this.container.current!.appendChild(button);
      isReadyToPay = true;
    }

    this.setState({ isReadyToPay }, () => {
      if (onReadyToPayChange) {
        onReadyToPayChange(isReadyToPay);
      }
    });
  }

  render() {
    const { isReadyToPay } = this.state;
    const { width, height } = this.props.appearance;
    const size: any = {};

    if (width) {
      size.width = getCssUnit(width);
    }

    if (height) {
      size.height = getCssUnit(height);
    }

    return (
      <div
          ref={this.container}
          style={{
            ...size,
            display: isReadyToPay ? 'inline-block' : 'none',
          }}
        />
    );
  }
}
