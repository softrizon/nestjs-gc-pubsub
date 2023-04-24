import { Message } from '@google-cloud/pubsub';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';

export class GCPubSubContext extends BaseRpcContext<[Message, string]> {
  constructor(args: [Message, string]) {
    super(args);
  }
}
