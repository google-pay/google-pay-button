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

/**
 * Defines the mock wrapper for selectively mocking methods on an object.
 */
export interface MockWrapper<T extends (...args: any[]) => any> {
  original: T;
  implementation: T;
  restore: () => void;
}

/**
 * Selectively mock methods on an existing object
 *
 * @param target Target object to apply the mock to.
 * @param functionName The function name on the object that will be mocked.
 * @param implementation The new implementation for the object.
 */
export function mock<TTarget, TFunction extends jest.FunctionPropertyNames<Required<TTarget>>>(
  target: TTarget,
  functionName: TFunction,
  implementation: Required<TTarget>[TFunction],
): Required<TTarget>[TFunction] extends (...args: any[]) => any ? MockWrapper<Required<TTarget>[TFunction]> : never;
export function mock<T>(
  target: T,
  functionName: string,
  implementation: (...args: any[]) => any,
): MockWrapper<(...args: any[]) => any>;
export function mock<T>(
  target: T,
  functionName: string,
  implementation: (...args: any[]) => any,
): MockWrapper<(...args: any[]) => any> {
  const obj: any = target;
  const original = (obj[functionName] as unknown) as (...args: any[]) => any;
  obj[functionName] = implementation as any;

  function restore(): void {
    obj[functionName] = original as any;
  }

  return {
    original,
    implementation,
    restore,
  };
}

/**
 * Returns a promise that waits for a specified amount of time.
 *
 * @param timeout Timeout in milliseconds to wait.
 */
export function wait(timeout: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
