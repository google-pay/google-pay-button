import React, { CSSProperties } from 'react';
import { Config, ButtonManager } from '../lib/button-manager';

export interface Props extends Config {
  className?: string;
  style?: CSSProperties;
}

const CLASS = 'google-pay-button-container';

export default class GooglePayButton extends React.Component<Props> {
  private instance = new ButtonManager(`.${CLASS}`);
  private elementRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const element = this.elementRef.current;
    if (element) {
      this.instance.mount(element);
      this.instance.configure(this.props);
    }
  }

  componentWillUnmount() {
    this.instance.unmount();
  }

  componentDidUpdate() {
    this.instance.configure(this.props);
  }

  render() {
    return (
      <div
        ref={this.elementRef}
        className={[CLASS, this.props.className].filter(c => c).join(' ')}
        style={this.props.style}
      />
    );
  }
}
