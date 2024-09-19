import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiException } from 'src/core/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/core/filter/enums/api-error-code.enum';
import encry from '../utils/crypto';
import * as crypto from 'crypto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (user) throw new ApiException('用户已存在', ApiErrorCode.USER_IS_TEXIST);
    try {
      const salt = crypto.randomBytes(4).toString('base64');
      createUserDto.password = encry(createUserDto.password, salt);
      createUserDto.salt = salt;
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    const data = await this.userRepository.findOne({ where: { username } });
    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
