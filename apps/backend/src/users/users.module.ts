import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UniqueEmailValidator } from './decorators/unique-email.decorator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UniqueEmailValidator],
})
export class UsersModule {}
