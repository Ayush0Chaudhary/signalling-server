import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  result: string;

  @Prop()
  classification: string;

  @Prop()
  notes: string;

  @Prop()
  details: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
