import React, { useState } from 'react';
import './App.css';
import BasicExample from './examples/BasicExample';
import EmailRequiredExample from './examples/EmailRequiredExample';
import ButtonAppearanceExample from './examples/ButtonAppearanceExample';
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

  function handleAmountChange(event: any) {
    setAmount(event.target.value);
  }

  function handleEnvironmentChange(event: any) {
    setEnvironment(event.target.value);
  }

  function handleExistingPaymentMethodRequired(event: any) {
    setExistingPaymentMethodRequired(event.target.value === 'yes');
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
      </div>
      <BasicExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <DirectIntegrationExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <EmailRequiredExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <AmexExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <CryptogramExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <RequireShippingExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <ShippingOptionsExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <PaymentAuthorizationExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <PaymentAuthorizationErrorExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <PaymentDataChangedExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <PaymentDataChangedErrorExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <OnCancelExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <DisplayItemsExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <DynamicPriceUpdateExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <ButtonAppearanceExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
      <StyleExample amount={amount} environment={environment} existingPaymentMethodRequired={existingPaymentMethodRequired} />
    </div>
  );
}

export default App;
