import { IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(2, 255)
  readonly name!: string;

  @IsString()
  @Length(2, 1024)
  readonly description!: string;
}
