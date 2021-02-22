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

import { Alias, Notify, NotifyAttribute, NotifyBooleanAttribute } from '../lib/property-decorators';
import { ButtonManager, Config, ReadyToPayChangeResponse } from '../lib/button-manager';
import { name as softwareId, version as softwareVersion } from './package.json';
import { debounce } from '../lib/debounce';

/**
 * Custom element for the Google Pay button
 */
class GooglePayButton extends HTMLElement {
  private manager = new ButtonManager({
    cssSelector: 'google-pay-button',
    softwareInfoId: softwareId,
    softwareInfoVersion: softwareVersion,
  });

  private static _observedAttributes: string[] = [];

  @Notify()
  @Alias('paymentrequest')
  paymentRequest!: google.payments.api.PaymentDataRequest;

  @NotifyAttribute()
  environment!: google.payments.api.Environment;

  @NotifyBooleanAttribute()
  @Alias('existingpaymentmethodrequired')
  existingPaymentMethodRequired!: boolean;

  @NotifyAttribute()
  @Alias('buttoncolor')
  buttonColor?: google.payments.api.ButtonColor;

  @NotifyAttribute()
  @Alias('buttontype')
  buttonType?: google.payments.api.ButtonType;

  @NotifyAttribute()
  @Alias('buttonsizemode')
  buttonSizeMode?: google.payments.api.ButtonSizeMode;

  @NotifyAttribute()
  @Alias('buttonlocale')
  buttonLocale?: string;

  @Notify()
  @Alias('paymentDataChangedCallback')
  @Alias('paymentdatachangedcallback')
  @Alias('onpaymentdatachanged')
  onPaymentDataChanged?: google.payments.api.PaymentDataChangedHandler;

  @Notify()
  @Alias('paymentAuthorizedCallback')
  @Alias('paymentauthorizedcallback')
  @Alias('onpaymentauthorized')
  onPaymentAuthorized?: google.payments.api.PaymentAuthorizedHandler;

  @Alias('readyToPayChangeCallback')
  @Alias('readytopaychangecallback')
  @Alias('onreadytopaychange')
  onReadyToPayChange?: (result: ReadyToPayChangeResponse) => void;

  @Alias('loadPaymentDataCallback')
  @Alias('loadpaymentdatacallback')
  @Alias('onloadpaymentdata')
  onLoadPaymentData?: (paymentData: google.payments.api.PaymentData) => void;

  @Alias('cancelCallback')
  @Alias('cancelcallback')
  @Alias('oncancel')
  onCancel?: (reason: google.payments.api.PaymentsError) => void;

  @Alias('errorCallback')
  @Alias('errorcallback')
  @Alias('onerror')
  onError?: (error: Error) => void;

  get isReadyToPay(): boolean | undefined {
    return this.manager.isReadyToPay;
  }

  private assertRequiredProperty(name: string): boolean {
    const value = (this as any)[name];
    if (value === null || value === undefined) {
      this.throwError(Error(`Required property not set: ${name}`));
      return false;
    }

    return true;
  }

  /**
   * Throws an error.
   *
   * Used for testing purposes so that the method can be spied on.
   */
  private throwError(error: Error): never {
    throw error;
  }

  static get observedAttributes(): string[] {
    return GooglePayButton._observedAttributes;
  }

  /**
   * Registers an attribute to be observed.
   *
   * @param name Attribute name to observe.
   * @internal
   */
  addObservedAttribute(name: string): void {
    GooglePayButton._observedAttributes.push(name);
  }

  private dispatch<T>(type: string, detail: T): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
  }

  private initializeButton = debounce(() => {
    if (!this.assertRequiredProperty('paymentRequest')) {
      return;
    }

    if (!this.assertRequiredProperty('environment')) {
      return;
    }

    const config: Config = {
      paymentRequest: this.paymentRequest,
      environment: this.environment,
      existingPaymentMethodRequired: this.existingPaymentMethodRequired,
      onPaymentDataChanged: this.onPaymentDataChanged,
      onPaymentAuthorized: this.onPaymentAuthorized,
      buttonColor: this.buttonColor,
      buttonType: this.buttonType,
      buttonSizeMode: this.buttonSizeMode,
      buttonLocale: this.buttonLocale,
      onReadyToPayChange: result => {
        if (this.onReadyToPayChange) {
          this.onReadyToPayChange(result);
        }
        this.dispatch('readytopaychange', result);
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
        this.dispatchEvent(new ErrorEvent('error', { error }));
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

  async connectedCallback(): Promise<void> {
    await this.manager.mount(this);
    return this.initializeButton();
  }

  disconnectedCallback(): void {
    this.manager.unmount();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attributeChangedCallback(name: string): Promise<void> {
    return this.initializeButton();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notifyPropertyChanged(property: string): Promise<void> {
    return this.initializeButton();
  }
}

interface GooglePayButton {
  addEventListener(
    type: 'loadpaymentdata',
    listener: (event: CustomEvent<google.payments.api.PaymentData>) => void,
  ): void;
  addEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  addEventListener(type: 'cancel', listener: (event: CustomEvent<google.payments.api.PaymentsError>) => void): void;
  addEventListener(type: 'readytopaychange', listener: (event: CustomEvent<boolean>) => void): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener(
    type: 'loadpaymentdata',
    listener: (event: CustomEvent<google.payments.api.PaymentData>) => void,
  ): void;
  removeEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  removeEventListener(type: 'cancel', listener: (event: CustomEvent<google.payments.api.PaymentsError>) => void): void;
  removeEventListener(type: 'readytopaychange', listener: (event: CustomEvent<boolean>) => void): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export default GooglePayButton;

customElements.define('google-pay-button', GooglePayButton);
