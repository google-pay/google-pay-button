# The Google Pay button

The [Google Pay API][google-pay] enables fast, simple checkout on your website. This provides convenient access to hundreds of millions of cards that are saved to Google Accounts worldwide.

This repository Google Pay button implementations for compatible with popular website frameworks even easier.

## Web componenent

The [Google Pay web component button][web-component-button] makes it easy to integrate Google Pay into your website using standards based custom elements. Web components can be used directly in a standard HTML web application as is, and is also compatible with Angular.

```sh
npm install @google-pay/web-component-button
```

Find out more about the [Google Pay web component button][web-component-button].

## React

Web components are more difficult to consume in a React application due to the extra work involved in binding to web component properties with React.

A separate [Google Pay React button][react-button] as been created to make it just as easy to integrate Google Pay into your React website.

```sh
npm install @google-pay/react-button
```

Find out more about the [Google Pay React button][react-button].

## Other frameworks

The intention is for the web component to support other web frameworks. Support for additional framework specific libraries will be considered based on demand.

[google-pay]: https://developers.google.com/pay/api/web/overview
[web-component-button]: src/web-component
[react-button]: src/react
