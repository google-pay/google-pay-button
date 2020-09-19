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

import '../lib/__mocks__';
import { MockWrapper, mock } from '../lib/__util__/test-util';
import { ButtonManager } from '../lib/button-manager';
import GooglePayButton from './GooglePayButton';
import defaults from '../lib/__setup__/defaults';

describe('Render', () => {
  function isMounted(this: ButtonManager): boolean {
    return !!this.getElement();
  }
  const throwError = jest.fn();

  let mocked: MockWrapper<(...args: any[]) => any>[];

  beforeEach(() => {
    mocked = [
      mock(ButtonManager.prototype, 'isMounted', isMounted),
      mock(GooglePayButton.prototype, 'throwError', throwError),
    ];
  });

  afterEach(() => {
    throwError.mockReset();
    for (const mock of mocked) {
      mock.restore();
    }
  });

  it('renders without crashing', async () => {
    const button = new GooglePayButton();
    button.paymentRequest = {
      ...defaults.paymentRequest,
    };

    await button.connectedCallback();
  });

  it('crashes when required property paymentRequest is not set', async () => {
    const button = new GooglePayButton();

    await button.connectedCallback();

    expect(throwError).toHaveBeenCalledWith(new Error('Required property not set: paymentRequest'));
  });

  it('crashes when required property environment is not set', async () => {
    const button = new GooglePayButton();
    button.paymentRequest = {
      ...defaults.paymentRequest,
    };

    await button.connectedCallback();

    expect(throwError).toHaveBeenCalledWith(new Error('Required property not set: environment'));
  });
});
