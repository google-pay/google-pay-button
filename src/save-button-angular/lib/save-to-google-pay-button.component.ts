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

import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { ButtonManager } from '../../lib/button-manager';
import { debounce } from '../../lib/debounce';

@Directive({
  selector: 'save-to-google-pay-button',
})
export class SaveToGooglePayButtonComponent implements OnInit, OnChanges {
  private manager = new ButtonManager();

  @Input() jwt!: string;
  @Input() height?: 'small' | 'standard';
  @Input() size?: 'matchparent' | undefined;
  @Input() textsize?: 'large' | undefined;
  @Input() theme?: 'dark' | 'light';

  @Input() successCallback?: () => void;
  @Input() failureCallback?: (error: Error) => void;
  @Input() provideJwtCallback?: () => string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): Promise<void> {
    return this.manager.mount(this.elementRef.nativeElement);
  }

  ngOnChanges(): Promise<void> {
    return this.initializeButton();
  }

  private initializeButton = debounce(() => {
    const config: gapi.savetoandroidpay.ButtonOptions = {
      jwt: this.jwt,
      height: this.height,
      size: this.size,
      textsize: this.textsize,
      theme: this.theme,
      onSuccess: () => {
        if (this.successCallback) {
          this.successCallback();
        }
        this.dispatch('success');
      },
      onFailure: (error: Error) => {
        if (this.failureCallback) {
          this.failureCallback(error);
        }
        this.dispatch('failure', error);
      },
    };

    if (this.provideJwtCallback) {
      config.onProvideJwt = this.provideJwtCallback;
    }

    this.manager.configure(config);
  });

  private dispatch<T>(type: string, detail?: T): void {
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
  }
}
