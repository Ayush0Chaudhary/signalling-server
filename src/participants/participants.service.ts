import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schema/participants.schema';
import { Model } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';
import { ConnectToProjectDto } from './dto/connect-to-project.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel('Participant') private participantModel: Model<Participant>,
    @InjectModel('Project') private projectModel: Model<Project>,
  ) {}

  async getAllParticipants() {
    return await this.participantModel.find();
  }

  async addParticipant(data: CreateParticipantDto) {
    const participant = new this.participantModel(data);
    return await participant.save().catch((err) => {
      console.log('Error: ', err.message);
      return 'Error occurred while saving the participant.';
    });
  }

  async getParticipant(id: string) {
    return await this.participantModel.findOne({ email: id });
  }

  async removeParticipant(id: string) {
    return await this.participantModel.deleteOne({ email: id });
  }

  async connectToProject(data: ConnectToProjectDto) {
    const participant = await this.participantModel.findOne({
      email: data.participantId,
    });
    const project = await this.projectModel.findOne({
      name: data.projectName,
    });
    participant.projects.push(project);
    project.participants.push(participant);
    await participant.save();
    await project.save();
    return participant;
  }

  async getParticipantProjects(id: string) {
    const participant = await this.participantModel.findOne({ email: id });
    if (!participant) return 'Participant not found';
    const projects = await this.projectModel.find({
      _id: { $in: participant.projects },
    });
    return projects;
  }
}
