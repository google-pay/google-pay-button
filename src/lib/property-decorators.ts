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
 * Describes notification target for the `Notify` decorators.
 */
interface NotifyTarget {
  notifyPropertyChanged: (name: string) => void;
  addObservedAttribute?: (name: string) => void;
  [key: string]: any;
}

/**
 * Converts a camelCase property name to a kebab-case attribute name.
 */
function getAttributeName(propertyName: string): string {
  return propertyName
    .replace(/[A-Z]+/g, sub => `-${sub}`)
    .replace(/^-/, '')
    .toLowerCase();
}

/**
 * Defines that the target property should be exposed as an attribute, and
 * that changes to the attribute should trigger a `notifyPropertyChanged`
 * callback.
 *
 * @param attribute Override the attribute name to use. If ommitted, the
 * property name is used (coverted from camelCase, to kebab-case).
 */
export function NotifyAttribute(attribute?: string) {
  return function (target: NotifyTarget & HTMLElement, key: string): void {
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
  };
}

/**
 * Defines that the target property should be exposed as boolean attribute, and
 * that changes to the attribute should trigger a `notifyPropertyChanged`
 * callback.
 *
 * @param attribute Override the attribute name to use. If ommitted, the
 * property name is used (coverted from camelCase, to snake-case).
 */
export function NotifyBooleanAttribute(attribute?: string) {
  return function (target: NotifyTarget & HTMLElement, key: string): void {
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
  };
}

/**
 * Defines that the target property should trigger a `notifyPropertyChanged`
 * callback when the property changes.
 *
 * @param attribute Expose the property as an attribute. Note that when
 * attribute is specified, this method has the same behavior as
 * `NotifyAttribute`.
 */
export function Notify(attribute?: string): (target: NotifyTarget & HTMLElement, key: string) => void {
  if (attribute) {
    return NotifyAttribute(attribute);
  }

  return function (target: NotifyTarget, key: string): void {
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
  };
}

/**
 * Creates an alias for the given property with a getter and a setter.
 *
 * @param alias Name of the alias.
 */
export function Alias(alias: string) {
  return function (target: NotifyTarget, key: string): void {
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
  };
}
