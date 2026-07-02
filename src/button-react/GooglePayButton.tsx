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

import { ButtonManager, Config } from '../lib/button-manager';
import React, { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { name as softwareId, version as softwareVersion } from './package.json';

/**
 * Properties for the Google Pay button React component
 */
export interface Props extends Config {
  className?: string;
  style?: CSSProperties;
}

const CLASS = 'google-pay-button-container';

/**
 * React component for the Google Pay button
 */
const GooglePayButton = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const manager = useMemo(
    () =>
      new ButtonManager({
        cssSelector: `.${CLASS}`,
        softwareInfoId: softwareId,
        softwareInfoVersion: softwareVersion,
      }),
    [],
  );

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      manager.configure(props);
      manager.mount(element);
    }
    return () => {
      manager.unmount();
    };
  }, []);

  useEffect(() => {
    manager.configure(props);
  }, [props]);

  return (
    <div
      ref={value => {
        (elementRef as any).current = value;
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref) {
          (ref as any).current = value;
        }
      }}
      className={[CLASS, props.className].filter(c => c).join(' ')}
      style={props.style}
    />
  );
});

GooglePayButton.displayName = 'GooglePayButton';

export default GooglePayButton;
