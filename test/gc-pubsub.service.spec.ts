import { PubSub, Topic } from '@google-cloud/pubsub';
import { GCPubSubService } from '../src';
import { GCPubSubClient } from '../src/gc-pubsub.client';

// jest.mock('@google-cloud/pubsub');

// eslint-disable-next-line
const publishMessageMock = jest.fn((...args: any[]) => Promise.resolve(''));
const closeMock = jest.fn(() => Promise.resolve());
const flushMock = jest.fn(() => Promise.resolve());
const topicMock = jest.fn((name) => <Topic>(<unknown>{ name, publishMessage: publishMessageMock, flush: flushMock }));

describe('GC PubSub Service', () => {
  let service: GCPubSubService;

  beforeAll(async () => {
    service = new GCPubSubService(new GCPubSubClient({}));
    await service.onModuleInit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    PubSub.prototype.topic = topicMock;
    PubSub.prototype.close = closeMock;
  });

  it('should call the `Topic#publishMessage` method of the Google API', (done) => {
    service
      .emit({
        topic: 'test-topic',
        message: 'evt.test-event',
        data: { payload: 'test' },
        attributes: { format: 'json' },
      })
      .subscribe(() => {
        expect(topicMock).toBeCalledTimes(1);
        expect(topicMock).toBeCalledWith('test-topic');
        expect(publishMessageMock).toBeCalledTimes(1);
        const [[emitOptions]] = publishMessageMock.mock.calls;

        expect(emitOptions.json).toEqual({ payload: 'test' });
        expect(emitOptions.attributes).toEqual({ format: 'json', message: 'evt.test-event' });

        done();
      });
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });
});
