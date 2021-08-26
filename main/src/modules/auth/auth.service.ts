import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './entities/token.entity';
import { generateToken } from '../../common/utils/generate-token.util';

const saltOrRounds = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  async validateUser({ username, password }: LoginInput): Promise<any> {
    const user = await this.usersService.findOneByUsernameWithPassword(
      username,
    );

    if (user && (await this.comparePasswords(password, user.password))) {
      delete user['_doc'].password;
      return this.getAccessToken(user);
    }
    return null;
  }

  async getAccessToken(user: any) {
    const refreshToken = await this.createRefreshToken(user);
    return {
      access_token: this.createAccessToken(user),
      expiresIn: this.configService.get<number>('jwt.expiresIn'),
      refresh_token: refreshToken.token,
    };
  }

  createAccessToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  createRefreshToken(user: User) {
    const token = generateToken(48);
    const expiresIn = this.configService.get<number>('jwt.refreshExpiresIn');

    return this.tokenModel.create({
      token,
      user,
      expiresOn: dayjs().add(expiresIn, 'second').toDate(),
    });
  }

  async findByToken(token) {
    return this.tokenModel.findOne({ token }).populate('user');
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
