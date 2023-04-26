import { Controller } from '@nestjs/common';
import { SubscriptionHandler, Message } from '../../src';

@Controller()
export class TestSubscriber {
  @SubscriptionHandler({ subscription: 'test-subscription', topic: 'test-topic' })
  handle(message: Message, ...rest: any[]) {
    return this.testableHandle(message, ...rest);
  }

  // This is a workaround to test the handler without the decorator
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  testableHandle(message: Message, ...rest: any[]) {
    return 'test';
  }
}
