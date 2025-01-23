# XMTP Quickstart Hooks (Next.js)

![Status](https://img.shields.io/badge/Deprecated-brown)

> [!CAUTION]
> XMTP Quickstart Hooks (Next.js) is no longer maintained.

The documentation below is provided for historical reference only.

## Installation

```bash
yarn install
yarn dev
```

## Concepts

Head to our docs to understand XMTP's concepts

- [Get started](https://xmtp.org/docs/build/get-started/overview?sdk=react)
- [Authentication](https://xmtp.org/docs/build/authentication?sdk=react)
- [Conversations](https://xmtp.org/docs/build/conversations?sdk=react)
- [Messages](https://xmtp.org/docs/build/messages/?sdk=react)
- [Streams](https://xmtp.org/docs/build/streams/?sdk=react)

#### Troubleshooting

For components to work in SSR Nextjs try this Dynamic omport

```jsx
const FloatingInbox = dynamic(() => import("./FloatingInbox-hooks"), {
  ssr: false,
});
```

If you get into issues with `Buffer` and `polyfills` check out the fix below:

- [Check out Buffer issue](https://github.com/xmtp/xmtp-js/issues/487)
