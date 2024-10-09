import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;

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
