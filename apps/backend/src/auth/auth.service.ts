import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos!');
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos!');
    }

    const token = this.jwtService.sign({ name: user.name, email: user.email, sub: user.id });
    return { accessToken: token };
  }
}
