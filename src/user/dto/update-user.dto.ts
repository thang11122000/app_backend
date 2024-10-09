import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  readonly password?: string;

  @IsBoolean()
  @IsOptional()
  readonly isVerified?: boolean;

  @IsString()
  @IsOptional()
  readonly forgotPasswordToken?: string;

  @IsOptional()
  readonly forgotPasswordTokenExpiry?: Date;

  @IsString()
  @IsOptional()
  readonly verifyToken?: string;

  @IsOptional()
  readonly verifyTokenExpiry?: Date;
}
