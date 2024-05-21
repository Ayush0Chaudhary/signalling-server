import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project } from './schemas/project.schema';
import { CreatedProjectDto } from './dto/create-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from 'src/task/schema/task.schema';
import { title } from 'process';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async test() {
    const project: CreatedProjectDto = {
      name: 'Project 1',
      tasks: ['Task 1', 'Task 2'],
      participants: ['Participant 1', 'Participant 2'],
      videoUrl: '',
    };
    return this.createProject(project);
  }
  async createProject(createdProjectDto: CreatedProjectDto) {
    if (await this.projectModel.findOne({ name: createdProjectDto.name })) {
      return 'Project already exists';
    }
    const createdProject = new this.projectModel(createdProjectDto);

    createdProject.save().catch((err) => {
      console.log(err);
      return;
    });

    return createdProject;
  }

  async addTask(createTaskDto: CreateTaskDto) {
    const project = await this.projectModel.findOne({
      name: createTaskDto.projectName,
    });
    delete createTaskDto.projectName;
    const createdTask = new this.taskModel(createTaskDto);
    createdTask
      .save()
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    project.tasks.push(createdTask);
    project.save();
    return project;
  }

  async deleteTask(deleteTask: DeleteTaskDto) {
    const project = await this.projectModel.findOne({
      name: deleteTask.projectName,
    });
    if (!project) {
      return 'Project not found';
    }
    const toBeDeletedTasks = await this.taskModel.find({
      title: deleteTask.title,
    });
    if (!toBeDeletedTasks) {
      return 'Task not found';
    }
    const newTasks = [];
    console.log(project.tasks);

    for (let i = 0; i < project.tasks.length; i++) {
      console.log(project.tasks[i], deleteTask.title);
      if (project.tasks[i].title !== deleteTask.title) {
        newTasks.push(project.tasks[i]);
      }
    }
    project.tasks = newTasks;
    // console.log(project.tasks.map((t) => t.title));
    project.save();
    await this.taskModel.deleteMany({ title: deleteTask.title });
    return project;
  }
}
