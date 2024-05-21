import { IsEmail, IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  projects: string[];
}
