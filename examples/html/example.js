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

import './node_modules/@google-pay/save-button-element/dist/index.js';

const button = document.querySelector('save-to-google-pay-button');

[...document.querySelectorAll('select')].forEach(select => {
  select.addEventListener('change', event => {
    const { name, value } = event.target;

    button.setAttribute(name, value);
  });
});

button.addEventListener('success', () => {
  console.log('success');
});

button.addEventListener('failure', event => {
  console.log('failure', event.detail);
});

// button.onProvideJwt = () => {
//   console.log('provide jwt');
//   return button.jwt;
// };
