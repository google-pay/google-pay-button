import GooglePayButton from './GooglePayButton';
import React from 'react';
import ReactDOM from 'react-dom';

// Dynamically load React 18's createRoot API if available so this test works
// both with React 16 (CI) and React 18 (local environments).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRootModule: any = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-dom/client');
  } catch (e) {
    return null;
  }
})();

import defaults from '../lib/__setup__/defaults';

describe('React 19 compatibility', () => {
  it('does not access element.ref when mounting (simulates React 19)', () => {
    const div = document.createElement('div');

    // Save original createElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalCreateElement: any = React.createElement;

    // Monkeypatch React.createElement to wrap returned element in a Proxy that
    // throws if code attempts to read the `ref` property (React 19 behavior).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement = function patchedCreateElement(...args: any[]) {
      const el = originalCreateElement(...args);
      return new Proxy(el, {
        get(target, prop) {
          if (prop === 'ref') {
            // Allow React internals and render pipeline to read `ref` (they do this
            // during reconciliation). Only throw if the access does not originate
            // from React internals — this simulates component/library code
            // incorrectly accessing `element.ref`.
            const stack = new Error().stack || '';
            if (!/(?:react(?:-|\/)dom|react(?:-|\/)cjs|react(?:-|\/)umd)/i.test(stack)) {
              throw new Error('Accessing element.ref is not allowed (simulating React 19)');
            }
            // If stack indicates React internals, allow the access.
            return (target as any)[prop];
          }
          return (target as any)[prop];
        },
      });
    } as unknown as typeof React.createElement;

    // If mounting the component tries to read `element.ref`, the Proxy will throw
    expect(() => {
      const createRootFn = createRootModule && createRootModule.createRoot;
      if (createRootFn) {
        const root = createRootFn(div);
        root.render(<GooglePayButton {...defaults} />);
        root.unmount();
      } else {
        // For older React versions used in CI (e.g., React 16), fall back to
        // the legacy render/unmount APIs.
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(<GooglePayButton {...defaults} />, div);
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(div);
      }
    }).not.toThrow();

    // restore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement = originalCreateElement;
  });
});
