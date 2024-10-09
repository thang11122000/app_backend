import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  forgotPasswordToken: string;

  @Prop({ default: null })
  forgotPasswordTokenExpiry: Date;

  @Prop({ default: null })
  verifyToken: string;

  @Prop({ default: null })
  verifyTokenExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
