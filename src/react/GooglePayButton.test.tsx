import React from 'react';
import ReactDOM from 'react-dom';
import GooglePayButton from './GooglePayButton';
import defaults from '../lib/__setup__/defaults';

describe('Render', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GooglePayButton {...defaults} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
