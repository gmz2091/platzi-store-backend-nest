import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  readonly customerID: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
