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

import { ButtonManager, Config } from '../../lib/button-manager';
import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { name as softwareId, version as softwareVersion } from '../package.json';
import { debounce } from '../../lib/debounce';

@Directive({
  selector: 'google-pay-button',
})
export class GooglePayButtonComponent implements OnInit, OnChanges {
  private manager = new ButtonManager({
    cssSelector: 'google-pay-button',
    softwareInfoId: softwareId,
    softwareInfoVersion: softwareVersion,
  });

  @Input() paymentRequest!: google.payments.api.PaymentDataRequest;
  @Input() environment!: google.payments.api.Environment;
  @Input() existingPaymentMethodRequired!: boolean;
  @Input() buttonColor?: google.payments.api.ButtonColor;
  @Input() buttonType?: google.payments.api.ButtonType;
  @Input() buttonSizeMode?: google.payments.api.ButtonSizeMode;
  @Input() buttonLocale?: string;
  @Input() paymentDataChangedCallback?: google.payments.api.PaymentDataChangedHandler;
  @Input() paymentAuthorizedCallback?: google.payments.api.PaymentAuthorizedHandler;
  @Input() readyToPayChangeCallback?: (result: any) => void;
  @Input() loadPaymentDataCallback?: (paymentData: google.payments.api.PaymentData) => void;
  @Input() cancelCallback?: (reason: google.payments.api.PaymentsError) => void;
  @Input() errorCallback?: (error: Error) => void;

  constructor(private elementRef: ElementRef) {}

  get isReadyToPay(): boolean | undefined {
    return this.manager.isReadyToPay;
  }

  ngOnInit(): Promise<void> {
    return this.manager.mount(this.elementRef.nativeElement);
  }

  ngOnChanges(): Promise<void> {
    return this.initializeButton();
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
      onPaymentDataChanged: this.paymentDataChangedCallback,
      onPaymentAuthorized: this.paymentAuthorizedCallback,
      buttonColor: this.buttonColor,
      buttonType: this.buttonType,
      buttonSizeMode: this.buttonSizeMode,
      buttonLocale: this.buttonLocale,
      onReadyToPayChange: result => {
        if (this.readyToPayChangeCallback) {
          this.readyToPayChangeCallback(result);
        }
        this.dispatch('readytopaychange', result);
      },
      onCancel: reason => {
        if (this.cancelCallback) {
          this.cancelCallback(reason);
        }
        this.dispatch('cancel', reason);
      },
      onError: error => {
        if (this.errorCallback) {
          this.errorCallback?.(error);
        }
        this.elementRef.nativeElement.dispatchEvent(new ErrorEvent('error', { error }));
      },
      onLoadPaymentData: paymentData => {
        if (this.loadPaymentDataCallback) {
          this.loadPaymentDataCallback(paymentData);
        }
        this.dispatch('loadpaymentdata', paymentData);
      },
    };

    this.manager.configure(config);
  });

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

  private dispatch<T>(type: string, detail: T): void {
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
  }
}
