import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';

export type ParticipantDocument = HydratedDocument<Participant>;

@Schema()
export class Participant {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: Project[];

  //NOTE: Consult Tamil about the relationship between Participant and Task

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  // tasks: Task[];
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
