import React from 'react';
import loadScript from './load-script';

interface BasePaymentRequest {
  apiVersion: number,
  apiVersionMinor: number,
  merchantInfo: any,
  allowedPaymentMethods: BasePaymentMethod[],
};

interface PaymentRequest extends BasePaymentRequest {
  emailRequired?: boolean,
  existingPaymentMethodRequired?: boolean,
  shippingAddressRequired?: boolean,
  shippingAddressParameters?: google.payments.api.ShippingAddressParameters,
  shippingOptionRequired?: boolean,
  shippingOptionParameters?: ShippingOptionParameters,
  transactionInfo: TransactionInfo,
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

interface BasePaymentMethod {
  type: string,
  parameters: any,
  tokenizationSpecification?: TokenizationSpecification,
}

interface TokenizationSpecification {
  type: string,
  parameters: any,
}

type DisplayItemType = 'LINE_ITEM' | 'SUBTOTAL' | string;
type DisplayItemStatus = 'FINAL' | 'PENDING' | string;
type TotalPriceStatus = 'ESTIMATED' | 'FINAL' | 'NOT_CURRENTLY_KNOWN' | string;
type CheckoutOption = 'DEFAULT' | 'COMPLETE_IMMEDIATE_PURCHASE' | string;

interface DisplayItem {
  label: string;
  type: DisplayItemType;
  price: string;
  status?: DisplayItemStatus;
}

interface TransactionInfo {
  totalPriceStatus: TotalPriceStatus;
  currencyCode: string;
  countryCode?: string;
  transactionId?: string;
  displayItems?: DisplayItem[];
  totalPriceLabel?: string;
  totalPrice?: string;
  checkoutOption?: CheckoutOption;
}

type Environment = 'TEST' | 'PRODUCTION';

export type Props = {
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
  allowedPaymentMethods: BasePaymentMethod[],
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
  },
  transactionInfo: TransactionInfo,
  className?: string,
  style?: any,
};

type State ={
  isReadyToPay: boolean,
};

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
