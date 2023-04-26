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
npm install @softrizon/nestjs-gcp-pubsub
```

## Usage

### Publish messages

- Module configuration

```ts
import { Module } from '@nestjs/common';
import { PubSubModule } from '@softrizon/gcp-pubsub';
import { MessageService } from './message.service';

@Module({
  imports: [
    PubSubModule.forRoot({
      config: { },
    }),
  ],
  providers: [MessageService],
})
export class AppModule {}

```

> NOTE: The `config` is the same interface as in the [@google-cloud/pubsub][googleapis-url] package.



- Inject the service (e.g., `MessageService`) to emit messages.

```ts
import { Injectable } from '@nestjs/common';
import { PubSubService } from '@softrizon/gcp-pubsub';

@Injectable()
export class MessageService {
  constructor(private pubsub: PubSubService) {}

  emit<T = any>(pattern: string, data: T): void {
    const emitOptions = {
      message: pattern;
      data: data;
      topic: 'topic-name';
      attributes: {
        format: 'json',
      }
    }
    this.pubsub.emit(emitOptions);
  }
}
```



### Subscribe on messages

- Server configuration

```ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PubSubServer } from '@softrizon/gcp-pubsub';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new PubSubServer({
      config: {  },
    }),
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
```

>
> NOTE: The `config` is the same interface as in the [@google-cloud/pubsub][googleapis-url] package.
>

- Register a subscription handler

```ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionHandler, Message } from '@softrizon/gcp-pubsub';

@Controller()
export class MessagesEventSubscriber {
  @SubscriptionHandler({ subscription: 'test-subscription', topic: 'test-topic' })
  async doSomething(@Payload() message: Message): Promise<any> | Observable<any> | any {
    // do something with the message...
  }
}
```


### Read more

Visit the [@google-cloud/pubsub][googleapis-url] repository to learn more about its key features,
configurations, limitations, and API.

## Author

Developed by [Softrizon](https://github.com/softrizon).

## License

This project is [MIT-licensed](LICENSE).

[googleapis-url]: https://github.com/googleapis/nodejs-pubsub

[version-img]: https://img.shields.io/npm/v/@softrizon/gcp-pubsub
[version-url]: https://www.npmjs.com/package/@softrizon/gcp-pubsub
[license-img]: https://img.shields.io/npm/l/@softrizon/gcp-pubsub
[license-url]: https://opensource.org/licenses/MIT