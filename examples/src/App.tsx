import React, { useState } from 'react';
import './App.css';
import BasicExample from './examples/BasicExample';
import EmailRequiredExample from './examples/EmailRequiredExample';
import ButtonAppearanceExample from './examples/ButtonAppearanceExample';
import AmexExample from './examples/AmexExample';
import ExistingAmexExample from './examples/ExistingAmexExample';
import RequireShippingExample from './examples/RequireShippingExample';
import ShippingOptionsExample from './examples/ShippingOptionsExample';
import PaymentAuthorizationExample from './examples/PaymentAuthorizationExample';
import PaymentAuthorizationErrorExample from './examples/PaymentAuthorizationErrorExample';
import PaymentDataChangedExample from './examples/PaymentDataChangedExample';
import PaymentDataChangedErrorExample from './examples/PaymentDataChangedErrorExample';
import OnCancelExample from './examples/OnCancelExample';
import DisplayItemsExample from './examples/DisplayItemsExample';
import DisplayItemsDynamicTotalExample from './examples/DisplayItemsDynamicTotalExample';
import DynamicPriceUpdateExample from './examples/DynamicPriceUpdateExample';
import StyleExample from './examples/StyleExample';
import ProductionExample from './examples/ProductionDirectExample';

const App: React.FC = () => {
  const [amount, setAmount] = useState('100.00');

  function handleAmountChange(event: any) {
    setAmount(event.target.value);
  }

  return (
    <div className="App">
      <div>
        <label>
          <span>Default Amount:</span>
          <input type='text' defaultValue={amount} onBlur={handleAmountChange} />
        </label>
      </div>
      <BasicExample amount={amount} />
      <ProductionExample amount={amount} />
      <EmailRequiredExample amount={amount} />
      <AmexExample amount={amount} />
      <ExistingAmexExample amount={amount} />
      <RequireShippingExample amount={amount} />
      <ShippingOptionsExample amount={amount} />
      <PaymentAuthorizationExample amount={amount} />
      <PaymentAuthorizationErrorExample amount={amount} />
      <PaymentDataChangedExample amount={amount} />
      <PaymentDataChangedErrorExample amount={amount} />
      <OnCancelExample amount={amount} />
      <DisplayItemsExample amount={amount} />
      <DisplayItemsDynamicTotalExample />
      <DynamicPriceUpdateExample />
      <ButtonAppearanceExample amount={amount} />
      <StyleExample amount={amount} />
    </div>
  );
}

export default App;
