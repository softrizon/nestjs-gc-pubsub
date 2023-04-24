import { Logger } from '@nestjs/common';
import { ClientConfig, Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { CustomTransportStrategy, MessageHandler, MessagePattern, Server } from '@nestjs/microservices';
import { ERROR_EVENT, MESSAGE_EVENT } from '@nestjs/microservices/constants';
import { first, from, isObservable, mergeMap, of } from 'rxjs';
import { GCPubSubContext } from './gc-pubsub.context';

/**
 * Supported server options.
 */
export interface GCPubSubServerOptions {
  config: ClientConfig;
}

export type SubscriptionPattern = {
  subscription: string;
  topic?: string;
};

// Use to decorate a method to subscribe to a topic.
export const GCSubscriptionHandler = (pattern: SubscriptionPattern) => MessagePattern(pattern);

/**
 * Custom transport strategy to handle google pub/sub messages.
 */
export class GCPubSubServer extends Server implements CustomTransportStrategy {
  protected readonly logger = new Logger(GCPubSubServer.name);
  protected client: PubSub;
  protected readonly clientConfig: ClientConfig;
  protected subscriptions: Subscription[] = [];

  constructor(protected readonly options: GCPubSubServerOptions) {
    super();
    this.clientConfig = this.options.config;
    this.client = new PubSub(this.clientConfig);
  }

  async listen(callback: (...optionalParams: unknown[]) => any) {
    const handlers = this.getHandlers();
    if (!handlers.size) {
      this.logger.warn('No handlers were found to handle incoming messages');
      return;
    }

    handlers.forEach((handler, pattern) => {
      const subscription = this.registerSubscription(pattern, handler);
      this.subscriptions.push(subscription);
    });

    callback();
  }

  async close() {
    await Promise.all(this.subscriptions.map((subscription) => subscription.close()));
    await this.client?.close();
  }

  private registerSubscription(pattern: string, handler: MessageHandler<Message, GCPubSubContext>): Subscription {
    const { subscription, topic: topicName } = JSON.parse(pattern) as SubscriptionPattern;

    const topic = topicName ? this.client.topic(topicName) : undefined;

    return this.client
      .subscription(subscription, { topic })
      .on(MESSAGE_EVENT, (message: Message) =>
        from(handler(message, new GCPubSubContext([message, pattern])))
          .pipe(
            mergeMap((handler) => (isObservable(handler) ? handler : of(handler))),
            first(),
          )
          .subscribe(),
      )
      .on(ERROR_EVENT, (err) => this.logger.error(err));
  }
}
