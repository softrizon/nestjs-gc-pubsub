import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { ClientConfig, PubSub, Topic } from '@google-cloud/pubsub';
import { Inject, Logger, NotImplementedException } from '@nestjs/common';

export type EmitOptions = {
  topic: string;
  message: string;
  data: object;
  attributes?: Record<string, string> & { message?: never };
};

export const ConfigProvider = 'PUBSUB_CLIENT_CONFIG';

export class GCPubSubClient extends ClientProxy {
  protected topics: Map<string, Topic> = new Map();
  protected pubSubClient: PubSub;

  private readonly logger: Logger = new Logger(GCPubSubClient.name);

  constructor(
    @Inject(ConfigProvider)
    private readonly clientConfig: ClientConfig,
  ) {
    super();
  }

  async connect(): Promise<PubSub> {
    return (this.pubSubClient ??= new PubSub(this.clientConfig));
  }

  async close() {
    const closingTopics = Array.from(this.topics.values()).map((topic) => topic.flush());
    await Promise.all(closingTopics);
    await this.pubSubClient.close();
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    const { topic, data, message, attributes = {} } = this.serialize(packet);
    return await this.getTopic(topic)
      .publishMessage({ json: data, attributes: { ...attributes, message } })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): () => void {
    throw new NotImplementedException('Use `dispatchEvent` instead.');
  }

  /**
   * Redecorates the packet with additional supported fields.
   */
  protected serialize(packet: ReadPacket): EmitOptions {
    const { topic, message, attributes } = packet.pattern as Omit<EmitOptions, 'data'>;
    return { data: packet.data, message: message.toUpperCase().replace(/-/gi, '_'), topic, attributes };
  }

  protected getTopic(topicName: string): Topic {
    const cachedTopic = this.topics.get(topicName);
    if (cachedTopic) return cachedTopic;

    const topic = this.pubSubClient.topic(topicName);
    this.topics.set(topicName, topic);
    return topic;
  }
}
