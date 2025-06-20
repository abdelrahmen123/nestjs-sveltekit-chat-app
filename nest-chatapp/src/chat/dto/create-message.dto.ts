import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  roomId: string;
}
