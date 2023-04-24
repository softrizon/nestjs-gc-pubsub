<img src="https://i.ibb.co/rxN33YX/poweredbysoftrizon.png" alt="Softrizon Logo" title="Softfrizon" align="right"/>

# Google Cloud Pub/Sub Wrapper for NestJS


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
import { Module } from '@nestjs/common';
import { GCPubSubModule } from '@softrizon/gc-pubsub';
import { MessageService } from './message.service';

@Module({
  imports: [
    GCPubSubModule.forRoot({
      config: { },
    }),
  ],
  providers: [MessageService],
})
export class AppModule {}

```

> NOTE: The `config` is the same interface as in the [PubSub][googleapis-url] package.



- Inject the service (e.g., `MessageService`) to emit messages.

```ts
import { Injectable } from '@nestjs/common';
import { GCPubSubService } from '@softrizon/gc-pubsub';

@Injectable()
export class MessageService {
  constructor(private pubsub: GCPubSubService) {}

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
import { GCPubSubServer } from '@softrizon/gc-pubsub';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new GCPubSubServer({
      config: {  },
    }),
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
```

>
> NOTE: The `config` is the same interface as in the [PubSub][googleapis-url] package.
>

- Register a subscription handler

```ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GCSubscriptionHandler, Message } from '@softrizon/gc-pubsub';

@Controller()
export class MessagesEventSubscriber {
  @GCSubscriptionHandler({ subscription: 'test-subscription', topic: 'test-topic' })
  async doSomething(@Payload() data: Message): Promise<any> | Observable<any> | any {
    // do something with data...
  }
}
```


### Read more

Visit the [main page][googleapis-url] to learn more about its key features,
configurations, limitations, and API.

## Author

Developed by [Softrizon](https://github.com/softrizon).

## License

This project is [MIT-licensed](LICENSE).

[googleapis-url]: https://github.com/googleapis/nodejs-pubsub