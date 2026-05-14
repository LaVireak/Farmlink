import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendResetOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
