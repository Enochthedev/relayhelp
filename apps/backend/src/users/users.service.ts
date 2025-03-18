import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto, FindOrCreateUserDto } from './dto/users.dto';
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

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { googleId }, relations: ['tenant'] });
    }

  async findByDiscordId(discordId: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { discordId }, relations: ['tenant'] });
  }

  async findByGithubId(githubId: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { githubId }, relations: ['tenant'] });
 }

  async findByAppleId(appleId: string): Promise<User | null> {
            return await this.userRepository.findOne({ where: { appleId }, relations: ['tenant'] });
  }

  async findByMicrosoftId(microsoftId: string): Promise<User | null> {
                return await this.userRepository.findOne({ where: { microsoftId }, relations: ['tenant'] });
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
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.toUserResponse(savedUser);
  }

  async findOrCreate(data: FindOrCreateUserDto): Promise<User> {
    let user = await this.findByEmail(data.email);

    if (!user) {
        const newUser = this.userRepository.create({
            email: data.email,
            googleId: data.googleId,
            discordId: data.discordId,
            githubId: data.githubId,
            appleId: data.appleId,
            microsoftId: data.microsoftId,
        });

        user = await this.userRepository.save(newUser);
    }

    return user;
  }


  async updateUser(data: UpdateUserDto): Promise<UserResponseDto> {
    // Find the user by id
    const user = await this.userRepository.findOne({ where: { id: data.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the user is trying to update email
    if (data.email && data.email !== user.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }

    // Update the user
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
      tenants: user.tenants ? user.tenants.map(tenant => tenant.id) : undefined,
      createdAt: user.createdAt,
    };
  }
}