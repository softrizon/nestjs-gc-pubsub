import { Module, DynamicModule } from '@nestjs/common';

import { GCPubSubService } from './gc-pubsub.service';
import { ConfigProvider, GCPubSubClient } from './gc-pubsub.client';
import { GCPubSubServerOptions } from './gc-pubsub.server';

@Module({ providers: [GCPubSubService, GCPubSubClient], exports: [GCPubSubService] })
export class GCPubSubModule {
  static forRoot(params: GCPubSubServerOptions): DynamicModule {
    return { global: true, module: GCPubSubModule, providers: [{ provide: ConfigProvider, useValue: params.config }] };
  }
}
