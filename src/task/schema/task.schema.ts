import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Project',
  //   required: true,
  // })
  // project: Project;

  @Prop()
  description: string;

  @Prop()
  details: string;

  @Prop()
  result: string;

  @Prop()
  classification: string;

  @Prop()
  notes: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
