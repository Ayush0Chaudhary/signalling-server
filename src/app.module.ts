import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebRtcGateway } from './webrtc/webrtc.gateway';
import { GroupcallGateway } from './groupcall/groupcall.gateway';
import { ProjectModule } from './project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [
    ProjectModule,
    MongooseModule.forRoot(
      'mongodb+srv://Ayush:aayyuusshh@cluster0.2mqet0p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    TaskModule,
    ParticipantsModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebRtcGateway, GroupcallGateway],
})
export class AppModule {}
