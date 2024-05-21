import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project } from './schemas/project.schema';
import { createdProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async test() {
    const project: createdProjectDto = {
      name: 'Project 1',
      tasks: ['Task 1', 'Task 2'],
      participants: ['Participant 1', 'Participant 2'],
    };
    return this.createProject(project);
  }
  async createProject(createdProjectDto: createdProjectDto) {
    const createdProject = new this.projectModel(createdProjectDto);
    return createdProject.save();
  }
}
