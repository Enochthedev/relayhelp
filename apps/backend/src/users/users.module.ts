import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Guest])], // ✅ Register User entity
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule], // ✅ Export TypeOrmModule so other modules can use UserRepository
})
export class UsersModule {}