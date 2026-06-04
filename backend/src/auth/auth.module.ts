import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'secret',
    signOptions: { expiresIn: '2h', algorithm: 'HS256' }
  })],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
