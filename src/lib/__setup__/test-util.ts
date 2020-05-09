export interface MockWrapper {
  original: (...args: any[]) => any;
  implementation: (...args: any[]) => any;
  restore: () => void;
}

export function mock(obj: any, functionName: string, implementation: (...args: any[]) => any): MockWrapper {
  const original = obj[functionName] as (...args: any[]) => any;
  obj[functionName] = implementation;

  function restore() {
    obj[functionName] = original;
  }

  return {
    original,
    implementation,
    restore,
  };
}

export function wait(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
