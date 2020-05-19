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

import { MockWrapper, mock } from './__util__/test-util';
import { clearScriptCache, loadScript } from './load-script';

let createElementMock: MockWrapper<(...args: any[]) => any>;
let appendChildMock: MockWrapper<(...args: any[]) => any>;
let scriptElement: HTMLScriptElement;

beforeEach(() => {
  clearScriptCache();
  createElementMock = mock(Document.prototype, 'createElement', function (name: string) {
    const element = createElementMock.original.bind(document)(name);
    if (name === 'script') {
      scriptElement = element;
    }
    return element;
  });
  appendChildMock = mock(Document.prototype, 'appendChild', () => {});
});

afterEach(() => {
  appendChildMock.restore();
  createElementMock.restore();
});

it('resolved when script loads', () => {
  const result = loadScript('https://pay.google.com/gp/p/js/pay.js');
  scriptElement.dispatchEvent(new Event('load'));

  expect(result).resolves.toBe(undefined);
});

it('rejects when script errors', () => {
  const result = loadScript('https://pay.google.com/gp/p/js/pay.js');
  scriptElement.dispatchEvent(new Event('error'));

  expect(result).rejects.toThrowError('Unable to load script https://pay.google.com/gp/p/js/pay.js');
});

it('returns the same promise when same resource is re-requested', () => {
  const first = loadScript('https://pay.google.com/gp/p/js/pay.js');
  const second = loadScript('https://pay.google.com/gp/p/js/pay.js');

  expect(second).toBe(first);
});

it('returns a different promise when different resources are requested', () => {
  const first = loadScript('https://pay.google.com/gp/p/js/pay.js?1');
  const second = loadScript('https://pay.google.com/gp/p/js/pay.js?2');

  expect(second).not.toBe(first);
});

it('returns a different promise for the same resource when the first request fails', async () => {
  const first = loadScript('https://pay.google.com/gp/p/js/pay.js');

  scriptElement.dispatchEvent(new Event('error'));

  try {
    await first;
  } catch (err) {
    expect(err.message).toBe('Unable to load script https://pay.google.com/gp/p/js/pay.js');
  }

  const second = loadScript('https://pay.google.com/gp/p/js/pay.js');

  expect(second).not.toBe(first);
});
