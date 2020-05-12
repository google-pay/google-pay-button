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

interface NotifyTarget {
  notifyPropertyChanged: (name: string) => void;
  addObservedAttribute?: (name: string) => void;
  [key: string]: any;
}

function getAttributeName(propertyName: string) {
  return propertyName.replace(/[A-Z]+/g, sub => `-${sub}`).replace(/^-/, '').toLowerCase();
}

export function NotifyAttribute(attribute?: string) {
  return function(target: NotifyTarget & HTMLElement, key: string) {
    const attr = attribute || getAttributeName(key);

    if (target.addObservedAttribute) {
      target.addObservedAttribute(attr);
    }

    Object.defineProperty(target, key, {
      get(this: NotifyTarget & HTMLElement) {
        return this.getAttribute(attr);
      },
      set(this: NotifyTarget & HTMLElement, value: any) {
        if (value === null || value === undefined) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, value);
        }
        this.notifyPropertyChanged(key);
      },
      enumerable: true,
      configurable: true,
    });
  }
}

export function NotifyBooleanAttribute(attribute?: string) {
  return function(target: NotifyTarget & HTMLElement, key: string) {
    const attr = attribute || getAttributeName(key);

    if (target.addObservedAttribute) {
      target.addObservedAttribute(attr);
    }

    Object.defineProperty(target, key, {
      get(this: NotifyTarget & HTMLElement) {
        return this.hasAttribute(attr);
      },
      set(this: NotifyTarget & HTMLElement, value: any) {
        if (value) {
          this.setAttribute(attr, '');
        } else {
          this.removeAttribute(attr);
        }
        this.notifyPropertyChanged(key);
      },
      enumerable: true,
      configurable: true,
    });
  }
}

export function Notify(attribute?: string) {
  if (attribute) {
    return NotifyAttribute(attribute);
  }

  return function(target: NotifyTarget, key: string) {
    Object.defineProperty(target, key, {
      get(this: NotifyTarget) {
        return this[`$__${key}`];
      },
      set(this: NotifyTarget, value: any) {
        this[`$__${key}`] = value;
        this.notifyPropertyChanged(key);
      },
      enumerable: true,
      configurable: true,
    });
  }
}

export function Alias(alias: string) {
  return function(target: NotifyTarget, key: string) {
    Object.defineProperty(target, alias, {
      get(this: NotifyTarget) {
        return this[key];
      },
      set(this: NotifyTarget, value: any) {
        this[key] = value;
      },
      enumerable: true,
      configurable: false,
    });
  }
}
