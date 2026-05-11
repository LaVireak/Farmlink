import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum OtpPurpose {
    SIGNUP = 'signup',
    RESET_PASSWORD = 'reset_password',
}

@Entity('email_otps')
@Index(['email', 'purpose'])
export class EmailOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    email: string;

    @Column({ type: 'enum', enum: OtpPurpose, default: OtpPurpose.SIGNUP })
    purpose: OtpPurpose;

    @Column({ name: 'code_hash', length: 255 })
    codeHash: string;

    @Column({ default: 0 })
    attempts: number;

    @Column({ name: 'max_attempts', default: 5 })
    maxAttempts: number;

    @Column({ name: 'expires_at', type: 'timestamptz' })
    expiresAt: Date;

    @Column({ name: 'consumed_at', type: 'timestamptz', nullable: true })
    consumedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
}
