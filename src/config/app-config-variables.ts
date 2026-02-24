import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AppConfig {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public readonly APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  public readonly DB_USER: string;

  @IsString()
  @IsNotEmpty()
  public readonly DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public readonly DB_NAME: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public DB_PORT: number;
}
