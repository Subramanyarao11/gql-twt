import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UploadsService } from 'src/upload/upload.service';
import type { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadsService: UploadsService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    await this.userRepository.update(id, updateUserInput);
    return this.findById(id);
  }

  async updateProfileImage(id: string, file: FileUpload): Promise<User> {
    const user = await this.findById(id);

    if (user.profileImage) {
      const publicId = this.uploadsService.getPublicIdFromUrl(
        user.profileImage,
      );
      await this.uploadsService.deleteImage(
        `twitter-clone/profiles/${publicId}`,
      );
    }

    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    const imageUrl = await this.uploadsService.uploadImage(
      base64,
      'twitter-clone/profiles',
    );

    await this.userRepository.update(id, { profileImage: imageUrl });
    return this.findById(id);
  }

  async updateCoverImage(id: string, file: FileUpload): Promise<User> {
    const user = await this.findById(id);

    if (user.coverImage) {
      const publicId = this.uploadsService.getPublicIdFromUrl(user.coverImage);
      await this.uploadsService.deleteImage(`twitter-clone/covers/${publicId}`);
    }

    const { createReadStream } = file;
    const stream = createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    const imageUrl = await this.uploadsService.uploadImage(
      base64,
      'twitter-clone/covers',
    );

    await this.userRepository.update(id, { coverImage: imageUrl });
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
