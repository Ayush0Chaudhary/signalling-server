import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebRtcGateway } from './webrtc/webrtc.gateway';
import { GroupcallGateway } from './groupcall/groupcall.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebRtcGateway, GroupcallGateway],
})
export class AppModule {}
