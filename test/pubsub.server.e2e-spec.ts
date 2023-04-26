import { INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { PubSubServer } from '../src';
import { TestSubscriber, removeSubscription, removeTopic } from './utils';
import { PubSub } from '@google-cloud/pubsub';

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('PubSub Server', () => {
  let app: INestMicroservice;
  let client: PubSub;
  let server: PubSubServer;

  beforeAll(async () => {
    const config = { projectId: 'test', apiEndpoint: 'http://127.0.0.1:8085', port: '8085' };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestSubscriber],
    }).compile();

    client = new PubSub(config);
    server = new PubSubServer({ config });

    app = moduleFixture.createNestMicroservice<MicroserviceOptions>({ strategy: server });

    await removeTopic(client, 'test-topic');
    await removeSubscription(client, 'test-subscription');

    await client.createTopic('test-topic');
    await client.createSubscription('test-topic', 'test-subscription');

    await app.listen();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should call the handler when a message is received', async () => {
    const MockedHandler = jest.spyOn(TestSubscriber.prototype, 'testableHandle');

    await client.topic('test-topic').publishMessage({
      json: { message: 'test' },
      attributes: { message: 'evt.test-event' },
    });

    await waitFor(1000);

    expect(MockedHandler).toBeCalledTimes(1);

    const [[message]] = MockedHandler.mock.calls;
    expect(message.data).toEqual(Buffer.from(JSON.stringify({ message: 'test' })));
    expect(message.attributes).toEqual({ message: 'evt.test-event' });
  });

  afterAll(async () => {
    await removeTopic(client, 'test-topic');
    await removeSubscription(client, 'test-subscription');
    await app.close();
  });
});
