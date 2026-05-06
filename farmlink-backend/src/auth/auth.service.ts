import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existing = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(body.password, 10);
    const user = this.userRepository.create({
      email: body.email,
      passwordHash: hashed,
      role: body.role ?? 'consumer',
    });

    await this.userRepository.save(user);
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(body: any) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(body.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: 'farm-jwt-secret-2026' },
    );

    return { access_token: token };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }
}