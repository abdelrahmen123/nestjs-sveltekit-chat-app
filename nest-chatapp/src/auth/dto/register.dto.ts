import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'username must be a string' })
  @MinLength(3, { message: 'username must be at least 3 characters long' })
  @MaxLength(20, { message: 'username must be at most 20 characters long' })
  username: string;

  @IsString({ message: 'email must be a string' })
  @MinLength(3, { message: 'email must be at least 3 characters long' })
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString({ message: 'image must be a string' })
  @MinLength(3, { message: 'image must be at least 3 characters long' })
  @IsUrl({}, { message: 'image is not valid' })
  image: string;
}
