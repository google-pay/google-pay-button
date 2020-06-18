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
 * Keeps track scripts that have been requested by loadScript.
 */
let cachedScripts: Record<string, Promise<any>> = {};

/**
 * Asynchronously loads a script keeping track of which scripts have already
 * requested and loaded.
 *
 * Multiple requests to the same resource will return the same promise.
 *
 * @param src Script URL to load
 */
export function loadScript(src: string): Promise<void> {
  const existing = cachedScripts[src];
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    // Create script
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Script event listener callbacks for load and error
    const onScriptLoad = (): void => {
      resolve();
    };

    const onScriptError = (): void => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      cleanup();

      // Remove from cachedScripts so that we can try loading again
      delete cachedScripts[src];
      script.remove();

      reject(new Error(`Unable to load script ${src}`));
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    // Add script to document body
    document.body.appendChild(script);

    // Remove event listeners on cleanup
    function cleanup(): void {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    }
  });

  cachedScripts[src] = promise;

  return promise;
}

/**
 * Clears the script cache. Used for testing purposes only.
 */
export function clearScriptCache(): void {
  cachedScripts = {};
}
