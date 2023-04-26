import { Module, DynamicModule } from '@nestjs/common';

import { PubSubService } from './pubsub.service';
import { ConfigProvider, PubSubClient } from './pubsub.client';
import { PubSubServerOptions } from './pubsub.server';

@Module({ providers: [PubSubService, PubSubClient], exports: [PubSubService] })
export class PubSubModule {
  static forRoot(params: PubSubServerOptions): DynamicModule {
    return { global: true, module: PubSubModule, providers: [{ provide: ConfigProvider, useValue: params.config }] };
  }
}
