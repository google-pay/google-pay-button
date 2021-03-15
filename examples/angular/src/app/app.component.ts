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

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  jwt =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb29nbGUiLCJvcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJodHRwOi8vbG9jYWxob3N0OjEzMzciLCJodHRwczovL3NhdmUtdG8tZ29vZ2xlLXBheS5zdGFja2JsaXR6LmlvIiwiaHR0cHM6Ly9ncGF5LWxpdmUtZGVtby1zdGFnaW5nLndlYi5hcHAiXSwiaXNzIjoic29jLWxveWFsdHlhcGktZGVtb0BhcHBzcG90LmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ0eXAiOiJzYXZldG93YWxsZXQiLCJwYXlsb2FkIjp7ImxveWFsdHlPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMTAwNDg2NjguYWxleF9hdF9leGFtcGxlLmNvbS1ncGF5LXJld2FyZHMifV19LCJpYXQiOjE2MTU1OTQ2NTF9.ZbEvdvkRh5nCuBq85bBEjR6216L7j6W10nyVWpPSAZlaSe8O6hJ_Ig-TrrvFtn7aHucMZr4cTmttONrlaFU-gFKMYHMEJFiZ-qv58sE9dNUdgUwTJWWzH8aukltM0pCBLHcpvLXTCpGk4PoXWM4q5H6WIjP1Jem8v1_YGdV6J_UBNyAGqJUE5XJnDgHl2qGFilTmF0el6EBFQLnF2PuIvyZcWXgbXgJLZfx-opepVAgODW5BQjQ7li8QoDl3ffdESO2-7qWVm-VoxLb8eDh3z3gRktPb8APh_VsaAb8mjvNCLk_SOPrQhpuph4b0Rg4xnt59u5c87_eD2kT3_IuHxw';
  height = 'small';
  size = '';
  textsize = '';
  theme = 'dark';

  onSuccess = (event: CustomEvent): void => {
    console.log('success');
  };

  onFailure = (event: CustomEvent<Error>): void => {
    console.error('failure', event.detail);
  };

  onProvideJwt = () => {
    console.log('provide jwt');
    return this.jwt;
  };
}
