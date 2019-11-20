import React from 'react';
import ReactDOM from 'react-dom';
import GooglePayButton from './GooglePayButton';
import defaults from './__setup__/defaults';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GooglePayButton {...defaults} onReadyToPayChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
