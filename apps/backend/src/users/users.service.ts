import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';
import { UserRole } from './dto/users.dto'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['tenant'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email }, relations: ['tenant'] });
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: data.role ? data.role : UserRole.USER,
      tenant: { id: data.tenantId },
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.toUserResponse(savedUser);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['tenant'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    await this.userRepository.save(user);
    return this.toUserResponse(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant.id,
      createdAt: user.createdAt,
    };
  }
}