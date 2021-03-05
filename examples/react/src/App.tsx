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
import DirectIntegrationExample from './examples/DirectIntegrationExample';
import ButtonSizeExample from './examples/ButtonSizeExample';

const App: React.FC = () => {
  const [amount, setAmount] = useState('100.00');
  const [existingPaymentMethodRequired, setExistingPaymentMethodRequired] = useState(false);
  const [buttonColor, setButtonColor] = useState('default');
  const [buttonType, setButtonType] = useState('buy');
  const [buttonLocale, setButtonLocale] = useState('');

  const props = {
    amount,
    existingPaymentMethodRequired,
    buttonColor,
    buttonType,
    buttonLocale,
  };

  return (
    <div className="App">
      <div className="params">
        <label>
          <span>Default amount:</span>
          <input type="text" defaultValue={amount} onBlur={event => setAmount(event.target.value)} />
        </label>
        <label>
          <span>Payment method required:</span>
          <select
            onChange={event => setExistingPaymentMethodRequired(event.target.value === 'yes')}
            value={existingPaymentMethodRequired ? 'yes' : 'no'}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label>
          <span>Button color:</span>
          <select onChange={event => setButtonColor(event.target.value)} value={buttonColor}>
            <option value="default">default</option>
            <option value="black">black</option>
            <option value="white">white</option>
          </select>
        </label>
        <label>
          <span>Button type:</span>
          <select onChange={event => setButtonType(event.target.value)} value={buttonType}>
            <option value="buy">buy</option>
            <option value="plain">plain</option>
            <option value="donate">donate</option>
            <option value="long">long</option>
            <option value="short">short</option>
          </select>
        </label>
        <label>
          <span>Button locale:</span>
          <select onChange={event => setButtonLocale(event.target.value)} value={buttonLocale}>
            <option value="">-</option>
            <option value="ar">Arabic</option>
            <option value="bg">Bulgarian</option>
            <option value="ca">Catalan</option>
            <option value="zh">Chinese</option>
            <option value="hr">Croatian</option>
            <option value="cs">Czech</option>
            <option value="da">Danish</option>
            <option value="nl">Dutch</option>
            <option value="en">English</option>
            <option value="et">Estonian</option>
            <option value="fi">Finnish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="el">Greek</option>
            <option value="id">Indonesian</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="ms">Malay</option>
            <option value="no">Norwegian</option>
            <option value="pl">Polish</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="sr">Serbian</option>
            <option value="sk">Slovak</option>
            <option value="sl">Slovenian</option>
            <option value="es">Spanish</option>
            <option value="sv">Swedish</option>
            <option value="th">Thai</option>
            <option value="tr">Turkish</option>
            <option value="uk">Ukrainian</option>
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
      <ButtonSizeExample {...props} />
    </div>
  );
};

export default App;
