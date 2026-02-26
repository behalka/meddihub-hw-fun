import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  @Length(2, 255)
  readonly name!: string;

  @ApiProperty({ example: 'This project is about building something great' })
  @IsString()
  @Length(2, 1024)
  readonly description!: string;
}
