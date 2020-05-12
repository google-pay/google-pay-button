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

let cachedScripts: Record<string, Promise<any>> = {};

export default function loadScript(src: string) {
  let existing = cachedScripts[src];
  if (existing) {
    return existing;
  }

  const promise = new Promise((resolve, reject) => {
    // Create script
    let script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Script event listener callbacks for load and error
    const onScriptLoad = () => {
      resolve();
    };

    const onScriptError = () => {
      cleanup();

      // Remove from cachedScripts we can try loading again
      existing = cachedScripts[src];
      if (existing) {
        delete cachedScripts[src];
      }
      script.remove();

      reject(new Error('Unable to load script'));
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    // Add script to document body
    document.body.appendChild(script);

    // Remove event listeners on cleanup
    function cleanup() {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  });

  cachedScripts[src] = promise;

  return promise;
}
