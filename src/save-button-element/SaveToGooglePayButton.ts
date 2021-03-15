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

import { Alias, Notify, NotifyAttribute } from '../lib/property-decorators';
import { ButtonManager } from '../lib/button-manager';
import { debounce } from '../lib/debounce';

/**
 * Custom element for the Save to Google Pay button
 */
class SaveToGooglePayButton extends HTMLElement {
  private manager = new ButtonManager();

  private static _observedAttributes: string[] = [];

  @NotifyAttribute()
  jwt!: string;

  @NotifyAttribute()
  height?: gapi.savetoandroidpay.ButtonHeight;

  @NotifyAttribute()
  size?: gapi.savetoandroidpay.ButtonSize;

  @NotifyAttribute()
  textsize?: gapi.savetoandroidpay.ButtonTextSize;

  @NotifyAttribute()
  theme?: gapi.savetoandroidpay.ButtonTheme;

  @Notify()
  @Alias('successCallback')
  @Alias('successcallback')
  @Alias('onsuccess')
  onSuccess?: gapi.savetoandroidpay.SuccessHandler;

  @Notify()
  @Alias('failureCallback')
  @Alias('failurecallback')
  @Alias('onfailure')
  onFailure?: gapi.savetoandroidpay.FailureHandler;

  @Notify()
  @Alias('provideJwtCallback')
  @Alias('providejwtcallback')
  @Alias('onprovidejwt')
  onProvideJwt?: gapi.savetoandroidpay.ProvideJwtHandler;

  static get observedAttributes(): string[] {
    return SaveToGooglePayButton._observedAttributes;
  }

  /**
   * Registers an attribute to be observed.
   *
   * @param name Attribute name to observe.
   * @internal
   */
  addObservedAttribute(name: string): void {
    SaveToGooglePayButton._observedAttributes.push(name);
  }

  private dispatch<T>(type: string, detail?: T): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
  }

  private initializeButton = debounce(() => {
    const config: gapi.savetoandroidpay.ButtonOptions = {
      jwt: this.jwt,
      height: this.height,
      size: this.size,
      textsize: this.textsize,
      theme: this.theme,
      onSuccess: () => {
        if (this.onSuccess) {
          this.onSuccess();
        }
        this.dispatch('success');
      },
      onFailure: (error: Error) => {
        if (this.onFailure) {
          this.onFailure(error);
        }
        this.dispatch('failure', error);
      },
    };

    if (this.onProvideJwt) {
      config.onProvideJwt = this.onProvideJwt;
    }

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

interface SaveToGooglePayButton {
  addEventListener(type: 'success', listener: (event: CustomEvent) => void): void;
  addEventListener(type: 'failure', listener: (event: CustomEvent<Error>) => void): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: 'success', listener: (event: CustomEvent) => void): void;
  removeEventListener(type: 'failure', listener: (event: CustomEvent<Error>) => void): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export default SaveToGooglePayButton;

customElements.define('save-to-google-pay-button', SaveToGooglePayButton);
