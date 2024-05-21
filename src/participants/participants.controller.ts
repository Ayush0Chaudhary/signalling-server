import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ConnectToProjectDto } from './dto/connect-to-project.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private participantsService: ParticipantsService) {}

  @Get('getAll')
  async getAllParticipants() {
    return this.participantsService.getAllParticipants();
  }

  @Post('addParticipant')
  async addParticipant(@Body() data: CreateParticipantDto) {
    return this.participantsService.addParticipant(data);
  }

  @Get('getParticipant/:id')
  async getParticipant(@Param('id') id: string) {
    return this.participantsService.getParticipant(id);
  }

  @Post('removeParticipant/:id')
  async removeParticipant(@Param('id') id: string) {
    return this.participantsService.removeParticipant(id);
  }

  @Post('connectToProject')
  async connectToProject(@Body() data: ConnectToProjectDto) {
    return this.participantsService.connectToProject(data);
  }
}
