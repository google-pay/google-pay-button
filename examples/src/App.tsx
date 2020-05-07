import React, { useState } from 'react';
import './App.css';
import BasicExample from './examples/BasicExample';
import EmailRequiredExample from './examples/EmailRequiredExample';
import AmexExample from './examples/AmexExample';
import CryptogramExample from './examples/CryptogramExample';
import RequireShippingExample from './examples/RequireShippingExample';
import ShippingOptionsExample from './examples/ShippingOptionsExample';
import PaymentAuthorizationExample from './examples/PaymentAuthorizationExample';
import PaymentAuthorizationErrorExample from './examples/PaymentAuthorizationErrorExample';
import PaymentDataChangedExample from './examples/PaymentDataChangedExample';
import PaymentDataChangedErrorExample from './examples/PaymentDataChangedErrorExample';
import OnCancelExample from './examples/OnCancelExample';
import DisplayItemsExample from './examples/DisplayItemsExample';
import DynamicPriceUpdateExample from './examples/DynamicPriceUpdateExample';
import StyleExample from './examples/StyleExample';
import DirectIntegrationExample from './examples/DirectIntegrationExample';

const App: React.FC = () => {
  const [amount, setAmount] = useState('100.00');
  const [environment, setEnvironment] = useState('TEST');
  const [existingPaymentMethodRequired, setExistingPaymentMethodRequired] = useState(false);
  const [buttonColor, setButtonColor] = useState('default');
  const [buttonType, setButtonType] = useState('long');

  function handleAmountChange(event: any) {
    setAmount(event.target.value);
  }

  function handleEnvironmentChange(event: any) {
    setEnvironment(event.target.value);
  }

  function handleExistingPaymentMethodRequired(event: any) {
    setExistingPaymentMethodRequired(event.target.value === 'yes');
  }

  function handleColorChange(event: any) {
    setButtonColor(event.target.value);
  }

  function handleTypeChange(event: any) {
    setButtonType(event.target.value);
  }

  const props = {
    amount,
    environment,
    existingPaymentMethodRequired,
    buttonColor: buttonColor,
    buttonType: buttonType,
  }

  return (
    <div className="App">
      <div className="params">
        <label>
          <span>Default amount:</span>
          <input type='text' defaultValue={amount} onBlur={handleAmountChange} />
        </label>
        <label>
          <span>Default environment:</span>
          <select onChange={handleEnvironmentChange} value={environment}>
            <option value="TEST">TEST</option>
            <option value="PRODUCTION">PRODUCTION</option>
          </select>
        </label>
        <label>
          <span>Payment method required:</span>
          <select onChange={handleExistingPaymentMethodRequired} value={existingPaymentMethodRequired ? 'yes' : 'no'}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label>
          <span>Button color:</span>
          <select onChange={handleColorChange} value={buttonColor}>
            <option value="default">default</option>
            <option value="black">black</option>
            <option value="white">white</option>
          </select>
        </label>
        <label>
          <span>Button type:</span>
          <select onChange={handleTypeChange} value={buttonType}>
            <option value="long">long</option>
            <option value="short">short</option>
          </select>
        </label>
      </div>
      <BasicExample {...props} />
      <DirectIntegrationExample {...props} />
      <EmailRequiredExample {...props} />
      <AmexExample {...props} />
      <CryptogramExample {...props} />
      <RequireShippingExample {...props} />
      <ShippingOptionsExample {...props} />
      <PaymentAuthorizationExample {...props} />
      <PaymentAuthorizationErrorExample {...props} />
      <PaymentDataChangedExample {...props} />
      <PaymentDataChangedErrorExample {...props} />
      <OnCancelExample {...props} />
      <DisplayItemsExample {...props} />
      <DynamicPriceUpdateExample {...props} />
      <StyleExample {...props} />
    </div>
  );
}

export default App;
