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

import { ButtonManager, Config } from '../lib/button-manager';
import { Notify, NotifyAttribute, NotifyBooleanAttribute, Alias } from '../lib/property-decorators';
import { debounce } from '../lib/debounce';

class GooglePayButton extends HTMLElement {
  private manager: ButtonManager;

  private static _observedAttributes: string[] = [];

  @Notify()
  paymentRequest?: google.payments.api.PaymentDataRequest;

  @NotifyAttribute()
  environment?: google.payments.api.Environment;

  @NotifyBooleanAttribute()
  existingPaymentMethodRequired!: boolean;

  @NotifyAttribute()
  buttonColor?: google.payments.api.ButtonColor;

  @NotifyAttribute()
  buttonType?: google.payments.api.ButtonType;

  @Notify()
  @Alias('paymentDataChangedCallback')
  onPaymentDataChanged?: google.payments.api.PaymentDataChangedHandler;

  @Notify()
  @Alias('paymentAuthorizedCallback')
  onPaymentAuthorized?: google.payments.api.PaymentAuthorizedHandler;

  @Alias('readyToPayChangeCallback')
  onReadyToPayChange?: (isReadyToPay: boolean) => void;

  @Alias('loadPaymentDataCallback')
  onLoadPaymentData?: (paymentData: google.payments.api.PaymentData) => void;

  @Alias('cancelCallback')
  onCancel?: (reason: google.payments.api.PaymentsError) => void;

  @Alias('errorCallback')
  onError?: (error: Error) => void;

  get isReadyToPay() {
    return this.manager.isReadyToPay;
  }

  private assertRequiredProperty(name: string) {
    const value = (this as any)[name];
    if (value === null || value === undefined) {
      this.throwError(Error(`Required property not set: ${name}`));
      return false;
    }

    return true;
  }

  /**
   * Used for testing purposes
   * @param error 
   */
  private throwError(error: Error) {
    throw error;
  }

  static get observedAttributes() {
    return GooglePayButton._observedAttributes;
  }

  /**
   * registers an attribute to be observed
   *
   * @param name Attribute name to observe
   * @internal
   */
  addObservedAttribute(name: string) {
    GooglePayButton._observedAttributes.push(name);
  }

  constructor() {
    super();

    if (ShadowRoot) {
      this.attachShadow({
        mode: 'open',
      });
      this.manager = new ButtonManager(':host');
    } else {
      this.manager = new ButtonManager('google-pay-button');
    }
  }

  private dispatch<T>(type: string, detail: T) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      detail,
    }));
  }

  private initializeButton = debounce(() => {
    if (!this.assertRequiredProperty('paymentRequest')) {
      return;
    }

    const config: Config = {
      paymentRequest: this.paymentRequest!,
      environment: this.environment,
      existingPaymentMethodRequired: this.existingPaymentMethodRequired,
      onPaymentDataChanged: this.onPaymentDataChanged,
      onPaymentAuthorized: this.onPaymentAuthorized,
      buttonColor: this.buttonColor,
      buttonType: this.buttonType,
      onReadyToPayChange: isReadyToPay => {
        if (this.onReadyToPayChange) {
          this.onReadyToPayChange(isReadyToPay);
        }
        this.dispatch('readytopaychange', isReadyToPay);
      },
      onCancel: reason => {
        if (this.onCancel) {
          this.onCancel(reason);
        }
        this.dispatch('cancel', reason);
      },
      onError: error => {
        if (this.onError) {
          this.onError?.(error);
        }
        this.dispatchEvent(new ErrorEvent('error', { error }))
      },
      onLoadPaymentData: paymentData => {
        if (this.onLoadPaymentData) {
          this.onLoadPaymentData(paymentData);
        }
        this.dispatch('loadpaymentdata', paymentData);
      },
    };

    this.manager.configure(config);
  });

  connectedCallback() {
    this.manager.mount(this.shadowRoot || this);
    return this.initializeButton();
  }

  disconnectedCallback() {
    this.manager.unmount();
  }

  attributeChangedCallback(name: string) {
    return this.initializeButton();
  }

  notifyPropertyChanged(property: string) {
    return this.initializeButton();
  }
}

interface GooglePayButton {
  addEventListener(type: 'loadpaymentdata', listener: (event: CustomEvent<google.payments.api.PaymentData>) => void): void;
  addEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  addEventListener(type: 'cancel', listener: (event: CustomEvent<google.payments.api.PaymentsError>) => void): void;
  addEventListener(type: 'readytopaychange', listener: (event: CustomEvent<boolean>) => void): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener(type: 'loadpaymentdata', listener: (event: CustomEvent<google.payments.api.PaymentData>) => void): void;
  removeEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  removeEventListener(type: 'cancel', listener: (event: CustomEvent<google.payments.api.PaymentsError>) => void): void;
  removeEventListener(type: 'readytopaychange', listener: (event: CustomEvent<boolean>) => void): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export default GooglePayButton;

customElements.define('google-pay-button', GooglePayButton);
