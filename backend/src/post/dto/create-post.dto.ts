import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 600)
  description: string;
}
