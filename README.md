# The Save to Google Pay button

The [Save to Google Pay button][save-to-google-pay] makes it easy embed the Save to Google Pay button into your
websites.

This repository takes the [Save to Google Pay button][save-to-google-pay] experience and makes the integration process
easier for those building websites with frameworks like React, Angular, Vue (and many others), or even those who don't
use a framework.

## Web component

[![npm version](https://badge.fury.io/js/%40google-pay%2Fsave-button-element.svg)][npm-element]

The [Save to Google Pay web component button][save-button-element] makes it easy to integrate the Save to Google Pay
button into your website using standards based custom elements. Web components can be used directly in a standard HTML
web application as is, and is also [compatible with many popular web frameworks][custom-elements-compatible].

```sh
npm install @google-pay/save-button-element
```

Find out more about the [Save to Google Pay web component button][save-button-element].

## React

[![npm version](https://badge.fury.io/js/%40google-pay%2Fsave-button-react.svg)][npm-react]

Web components are more difficult to consume in a React application due to the extra work involved in binding to web
component properties with React.

A separate [Save to Google Pay React button][save-button-react] as been created to make it just as easy to integrate the
Save to Google Pay button into your React website.

```sh
npm install @google-pay/save-button-react
```

Find out more about the [Save to Google Pay React button][save-button-react].

## Angular

[![npm version](https://badge.fury.io/js/%40google-pay%2Fsave-button-angular.svg)][npm-angular]

An Angular version of the [Save to Google Pay button][save-button-angular] as been created to make it just as easier to
integrate the Save to Google Pay button into your Angular website. The advantage of using the Angular version of the
Google Pay button over the web component is that it eliminates the need to register `CUSTOM_ELEMENTS_SCHEMA`.

```sh
npm install @google-pay/save-button-angular
```

Find out more about the [Save to Google Pay Angular button][save-button-angular].

## Other frameworks

The intention is for the web component to support other web frameworks. Support for additional framework specific
libraries will be considered based on demand.

## Have any questions?

Ask it on the [discussions](https://github.com/google-pay/save-to-google-pay-button/discussions) section of the Google
Pay button project.

[save-to-google-pay]: https://developers.google.com/pay/passes/reference/s2w-reference
[save-button-element]: src/save-button-element
[save-button-react]: src/save-button-react
[save-button-angular]: src/save-button-angular
[live-demo]: https://developers.google.com/pay/api/web/guides/resources/demos
[custom-elements-compatible]: https://custom-elements-everywhere.com/
[npm-element]: https://www.npmjs.com/package/@google-pay/save-button-element
[npm-react]: https://www.npmjs.com/package/@google-pay/save-button-react
[npm-angular]: https://www.npmjs.com/package/@google-pay/save-button-angular
