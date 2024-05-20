import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  tasks: [string];

  @Prop({ required: true })
  participants: [string];
}

export const CatSchema = SchemaFactory.createForClass(Project);
