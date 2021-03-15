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

import React, { CSSProperties } from 'react';
import { ButtonManager } from '../lib/button-manager';

/**
 * Properties for the Save to Google Pay button React component
 */
export interface Props extends gapi.savetoandroidpay.ButtonOptions {
  className?: string;
  style?: CSSProperties;
}

const CLASS = 'google-pay-button-container';

/**
 * React component for the Save to Google Pay button
 */
export default class SaveToGooglePayButton extends React.Component<Props> {
  private manager = new ButtonManager();
  private elementRef = React.createRef<HTMLDivElement>();

  async componentDidMount(): Promise<void> {
    const element = this.elementRef.current;
    if (element) {
      await this.manager.mount(element);
      this.manager.configure(this.getButtonOptions());
    }
  }

  componentWillUnmount(): void {
    this.manager.unmount();
  }

  componentDidUpdate(): void {
    this.manager.configure(this.getButtonOptions());
  }

  private getButtonOptions(): gapi.savetoandroidpay.ButtonOptions {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { className, style, ...options } = { ...this.props };
    return options;
  }

  render(): JSX.Element {
    return (
      <div
        ref={this.elementRef}
        className={[CLASS, this.props.className].filter(c => c).join(' ')}
        style={this.props.style}
      />
    );
  }
}
