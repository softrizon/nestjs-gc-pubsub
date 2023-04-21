<img src="https://i.ibb.co/rxN33YX/poweredbysoftrizon.png" alt="Softrizon Logo" title="Softfrizon" align="right"/>

# Google Cloud Pub/Sub Wrapper for NestJS

[![npm version][version-img]][version-url]
[![MIT License][license-img]][license-url]

## Description

This is a custom transport strategy wrapper for Google Cloud Pub/Sub within the
NestJS framework. In other words, it provides a simple way to publish and
subscribe to a topic.

## Installation

This service is built with Node (`v18.12.1` using `npm@8.13.2`) and NestJS.

```bash
npm install @softrizon/nestjs-gc-pubsub
```

## Usage

### Publish messages

- Module configuration

```ts

```

- Inject the service (e.g., `MessageService`) to emit messages.

```ts

```

### Subscribe on messages

- Server configuration

```ts

```

- Subscribe to message pattern

```ts

```

> Note: Do not forget to register the controller in the corresponding module.
> In the example above, the message pattern is an object with the keys `event`
> and `format`. This is a practice useful for filtering events in the one-to-many
> pubsub architecture. If you don't need this kind of filtering, you may need to
> extend `PubSubServer` and override the `handleMessage` and `getData` methods.

### Read more

Visit the [main page][googleapis-url] to learn more about its key features,
configurations, limitations, and API.

## Author

Developed by [Softrizon](https://github.com/softrizon).

## License

This project is [MIT-licensed](LICENSE).

[googleapis-url]: https://github.com/googleapis/nodejs-pubsub
[version-img]: https://img.shields.io/npm/v/@softrizon/nestjs-gc-pubsub
[version-url]: https://www.npmjs.com/package/@softrizon/nestjs-gc-pubsub
[license-img]: https://img.shields.io/npm/l/@softrizon/nestjs-gc-pubsub
[license-url]: https://opensource.org/licenses/MIT
