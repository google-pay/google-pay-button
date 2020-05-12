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

export function debounce<T>(func: (...params: any[]) => T, wait: number = 0): () => Promise<T> {
  let timeout: number | undefined;

  return function(...args: any[]) {
    window.clearTimeout(timeout);

    var later = function() {
      timeout = undefined;
      return func.apply<any, any[], T>(null, args);
    };

    return new Promise(resolve => {
      timeout = window.setTimeout(() => {
        const result = later();
        resolve(result);
      }, wait);     
    });
  };
};
