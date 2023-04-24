import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { EmitOptions, GCPubSubClient } from './gc-pubsub.client';
import { Observable } from 'rxjs';

@Injectable()
export class GCPubSubService implements OnModuleInit, OnModuleDestroy {
  constructor(protected readonly client: GCPubSubClient) {}

  emit<T>(emitOptions: EmitOptions): Observable<T> {
    const { data, ...pattern } = emitOptions;
    return this.client.emit<T>(pattern, data);
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
