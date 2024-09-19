import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import encry from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from 'src/core/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/core/filter/enums/api-error-code.enum';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

interface User {
  username: string;
  password: string;
  salt: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async login(createAuthDto: CreateAuthDto) {
    const user: any = await this.userService.findOne(createAuthDto.username);
    console.log('🚀 ~ AuthService ~ login ~ user:', user);
    if (!user)
      throw new ApiException(
        '用户不存在或密码错误',
        ApiErrorCode.USER_NOTEXIST,
      );
    if (user?.password !== encry(createAuthDto.password, user.salt)) {
      throw new ApiException(
        '用户不存在或密码错误',
        ApiErrorCode.USER_NOTEXIST,
      );
    }
    const payload = { username: user.username, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }
}
