# The Google Pay button

The [Google Pay API][google-pay] enables fast, simple checkout on your website. This provides convenient access to
hundreds of millions of cards that are saved to Google Accounts worldwide.

See Google Pay in action:

[![Buy with Google Pay](docs/images/google-pay-button.svg)][live-demo]

This repository contains Google Pay button implementations for compatible with popular website frameworks even easier.

## Web component

[![npm version](https://badge.fury.io/js/%40google-pay%2Fbutton-element.svg)][npm-element]

The [Google Pay web component button][button-element] makes it easy to integrate Google Pay into your website using
standards based custom elements. Web components can be used directly in a standard HTML web application as is, and is
also [compatible with many popular web frameworks][custom-elements-compatible].

```sh
npm install @google-pay/button-element
```

Find out more about the [Google Pay web component button][button-element].

## React

[![npm version](https://badge.fury.io/js/%40google-pay%2Fbutton-react.svg)][npm-react]

Web components are more difficult to consume in a React application due to the extra work involved in binding to web
component properties with React.

A separate [Google Pay React button][button-react] as been created to make it just as easy to integrate Google Pay into
your React website.

```sh
npm install @google-pay/button-react
```

Find out more about the [Google Pay React button][button-react].

## Angular

[![npm version](https://badge.fury.io/js/%40google-pay%2Fbutton-angular.svg)][npm-angular]

An Angular version of the [Google Pay button][button-angular] as been created to make it just as easier to integrate
Google Pay into your Angular website. The advantage of using the Angular version of the Google Pay button over the web
component is that it eliminates the need to register `CUSTOM_ELEMENTS_SCHEMA`.

```sh
npm install @google-pay/button-angular
```

Find out more about the [Google Pay Angular button][button-angular].

## Other frameworks

The intention is for the web component to support other web frameworks. Support for additional framework specific
libraries will be considered based on demand.

## Have any questions?

Ask it on the [discussions](https://github.com/google-pay/google-pay-button/discussions) section of the Google Pay
button project.

[google-pay]: https://developers.google.com/pay/api/web/overview
[button-element]: src/button-element
[button-react]: src/button-react
[button-angular]: src/button-angular
[live-demo]: https://developers.google.com/pay/api/web/guides/resources/demos
[custom-elements-compatible]: https://custom-elements-everywhere.com/
[npm-element]: https://www.npmjs.com/package/@google-pay/button-element
[npm-react]: https://www.npmjs.com/package/@google-pay/button-react
[npm-angular]: https://www.npmjs.com/package/@google-pay/button-angular
