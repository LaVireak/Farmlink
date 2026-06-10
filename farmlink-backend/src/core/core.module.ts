import { Module } from '@nestjs/common';
import { EventEmitter } from 'events';
import { EVENT_PUBLISHER } from './token';

class CoreEventEmitter extends EventEmitter {
  publish(event: string, payload: any) {
    this.emit(event, payload);
  }
}

const eventPublisher = new CoreEventEmitter();

@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useValue: eventPublisher,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class CoreModule {}
