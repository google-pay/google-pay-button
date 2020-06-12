# The Google Pay button

The [Google Pay API][google-pay] enables fast, simple checkout on your website. This provides convenient access to
hundreds of millions of cards that are saved to Google Accounts worldwide.

See Google Pay in action:

[![Buy with Google Pay](docs/images/google-pay-button.svg)][live-demo]

This repository contains Google Pay button implementations for compatible with popular website frameworks even easier.

## Web componenent

The [Google Pay web component button][button-element] makes it easy to integrate Google Pay into your website using
standards based custom elements. Web components can be used directly in a standard HTML web application as is, and is
also [compatible with many popular web frameworks][custom-elements-compatible].

```sh
npm install @google-pay/button-element
```

Find out more about the [Google Pay web component button][button-element].

## React

Web components are more difficult to consume in a React application due to the extra work involved in binding to web
component properties with React.

A separate [Google Pay React button][button-react] as been created to make it just as easy to integrate Google Pay into
your React website.

```sh
npm install @google-pay/button-react
```

Find out more about the [Google Pay React button][button-react].

## Other frameworks

The intention is for the web component to support other web frameworks. Support for additional framework specific
libraries will be considered based on demand.

[google-pay]: https://developers.google.com/pay/api/web/overview
[button-element]: src/button-element
[button-react]: src/button-react
[live-demo]: https://developers.google.com/pay/api/web/guides/resources/demos
[custom-elements-compatible]: https://custom-elements-everywhere.com/
