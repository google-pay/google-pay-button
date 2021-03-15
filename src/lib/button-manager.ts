/* eslint-disable @typescript-eslint/no-namespace */
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

/* eslint-disable react/no-is-mounted */

import { loadScript } from '../lib/load-script';

declare global {
  namespace gapi {
    namespace savetoandroidpay {
      type ButtonHeight = 'small' | 'standard';
      type ButtonSize = 'matchparent' | undefined;
      type ButtonTextSize = 'large' | undefined;
      type ButtonTheme = 'dark' | 'light';

      type SuccessHandler = () => void;
      type FailureHandler = (error: Error) => void;
      type ProvideJwtHandler = () => string;

      interface ButtonOptions {
        jwt: string;
        height?: ButtonHeight;
        size?: ButtonSize;
        textsize?: ButtonTextSize;
        theme?: ButtonTheme;

        onSuccess?: SuccessHandler;
        onFailure?: FailureHandler;
        onProvideJwt?: ProvideJwtHandler;
      }

      function render(domId: string | Element, options: ButtonOptions): void;
    }
  }
}

/**
 * Manages the lifecycle of the Save to Google Pay button.
 */
export class ButtonManager {
  private config?: gapi.savetoandroidpay.ButtonOptions;
  private element?: Element;

  getElement(): Node | undefined {
    return this.element;
  }

  private isScriptLoaded(): boolean {
    return 'gapi' in (window || global) && !!gapi?.savetoandroidpay;
  }

  async mount(element: Element): Promise<void> {
    if (!this.isScriptLoaded()) {
      await loadScript('https://apis.google.com/js/platform.js');
    }

    this.element = element;
    if (element) {
      if (this.config) {
        await this.updateElement();
      }
    }
  }

  unmount(): void {
    this.element = undefined;
  }

  configure(newConfig: gapi.savetoandroidpay.ButtonOptions): Promise<void> {
    this.config = newConfig;
    return this.updateElement();
  }

  private isMounted(): boolean {
    return this.element != null && this.element.isConnected !== false;
  }

  private async updateElement(): Promise<void> {
    if (!this.isMounted()) return;
    const element = this.element!;

    if (!this.config) {
      throw new Error('google-pay-button: Missing configuration');
    }

    // const rootNode = this.element?.getRootNode();

    if (!this.isMounted()) return;

    gapi.savetoandroidpay.render(element, {
      ...this.config,
    });
  }
}
