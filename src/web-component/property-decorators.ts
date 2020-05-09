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
