import React from 'react';
import loadScript from './load-script';

export type Props = {
  environment: google.payments.api.Environment,
  version: {
    major: number,
    minor: number,
  },
  emailRequired?: boolean,
  existingPaymentMethodRequired?: boolean,
  merchantInfo: google.payments.api.MerchantInfo,
  allowedPaymentMethods: google.payments.api.PaymentMethodSpecification[],
  shippingAddressRequired?: boolean,
  shippingAddressParameters?: google.payments.api.ShippingAddressParameters,
  shippingOptionParameters?: google.payments.api.ShippingOptionParameters,
  onPaymentDataChanged?: Function,
  onPaymentAuthorized?: Function,
  onPaymentDataResult?: Function,
  onCancel?: Function,
  onError?: Function,
  onReadyToPayChange?: Function,
  appearance: {
    buttonColor?: google.payments.api.ButtonColor,
    buttonType?: google.payments.api.ButtonType,
  },
  transactionInfo: google.payments.api.TransactionInfo,
  className?: string,
  style?: any,
};

type State ={
  isReadyToPay: boolean,
};

export default class GooglePayButton extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
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

  private paymentRequest?: google.payments.api.PaymentDataRequest;
  private client?: google.payments.api.PaymentsClient;

  constructor(props: Props) {
    super(props);

    this.state = {
      isReadyToPay: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  buildPaymentRequest(): google.payments.api.PaymentDataRequest {
    const paymentRequest: google.payments.api.PaymentDataRequest = {
      apiVersion: this.props.version.major,
      apiVersionMinor: this.props.version.minor,
      merchantInfo: this.props.merchantInfo,
      allowedPaymentMethods: this.props.allowedPaymentMethods,
      emailRequired: this.props.emailRequired,
      transactionInfo: this.props.transactionInfo,
      shippingAddressRequired: this.props.shippingAddressRequired,
      shippingAddressParameters: this.props.shippingAddressParameters,
    };
    const callbackIntents: google.payments.api.CallbackIntent[] = [];

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

    const transactionInfo = paymentRequest.transactionInfo;
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

    this.client!.loadPaymentData(paymentRequest)
      .then(paymentResponse => {
        if (this.props.onPaymentDataResult) {
          this.props.onPaymentDataResult(paymentResponse);
        }
      })
      .catch(error => {
        if (error.statusCode === 'CANCELED') {
          if (this.props.onCancel) {
            this.props.onCancel(error);
          }
        } else if (this.props.onError) {
          this.props.onError(error);
        }
        console.log('Error', { error, paymentRequest });
      });
  }

  async componentDidMount() {
    await loadScript('https://pay.google.com/gp/p/js/pay.js');
    const google = window.google;

    const { environment, onPaymentDataChanged, onPaymentAuthorized, onReadyToPayChange, existingPaymentMethodRequired } = this.props
    const clientConfig: google.payments.api.PaymentOptions = {
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
    const readyToPayResponse = await this.client.isReadyToPay(this.baseRequest as google.payments.api.IsReadyToPayRequest);
    let isReadyToPay = false;

    if ((existingPaymentMethodRequired && readyToPayResponse.paymentMethodPresent && readyToPayResponse.result)
      || (!existingPaymentMethodRequired && readyToPayResponse.result)) {
      this.client.createButton({
        onClick: () => {},
      });
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
    const { className, style, appearance } = this.props;

    const color = appearance.buttonColor === 'default' ? 'black' : appearance.buttonColor;
    const buttonType = appearance.buttonType || 'long';

    const classNames = ['gpay-button', color, buttonType, className]
      .filter(c => c)
      .join(' ');

    return (
        isReadyToPay &&
        <button
          type='button'
          aria-label='Google Pay'
          className={classNames}
          style={style}
          onClick={this.handleClick}
        />
    );
  }
}
