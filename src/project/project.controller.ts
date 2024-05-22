import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreatedProjectDto } from './dto/create-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async test() {
    return this.projectService.test();
  }

  @Post('create')
  createProject(@Body() createdProjectDto: CreatedProjectDto) {
    return this.projectService.createProject(createdProjectDto);
  }

  @Post('addTask')
  addTask(@Body() createTaskDto: CreateTaskDto) {
    return this.projectService.addTask(createTaskDto);
  }

  @Post('deleteTask')
  deleteTask(@Body() task: DeleteTaskDto) {
    return this.projectService.deleteTask(task);
  }

  @Get('getTasks/:id')
  getTasks(@Param('id') id: string) {
    return this.projectService.getTasks(id);
  }

  @Post('updateTask')
  updateTask(@Body() task: CreateTaskDto) {
    return this.projectService.updateTask(task);
  }
  @Get('getParticipants/:id')
  getParticipants(@Param('id') id: string) {
    return this.projectService.getParticipants(id);
  }
}
