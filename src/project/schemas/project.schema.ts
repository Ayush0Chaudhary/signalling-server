import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Participant } from 'src/participants/schema/participants.schema';
import { Task } from 'src/task/schema/task.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  })
  participants: Participant[];

  @Prop()
  videoUrl: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
