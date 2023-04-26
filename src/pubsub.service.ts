import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { EmitOptions, PubSubClient } from './pubsub.client';
import { Observable } from 'rxjs';

@Injectable()
export class PubSubService implements OnModuleInit, OnModuleDestroy {
  constructor(protected readonly client: PubSubClient) {}

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
