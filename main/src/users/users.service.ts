import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  findByUsernameWithPassword(username: string) {
    return this.findByUsername(username).select('+password');
  }

  async create(createUserDto: CreateUserDto) {
    await this.isUserUnique(createUserDto);
    const hashPass = await this.authService.hashPassword(
      createUserDto.password,
    );

    await this.userModel.create({ ...createUserDto, password: hashPass });
  }

  async isUserUnique({ username, email }: CreateUserDto) {
    const usernameExist = await this.userModel.exists({ username });
    const emailExist = await this.userModel.exists({ email });

    if (usernameExist || emailExist) {
      throw new ConflictException({
        exist: {
          username: usernameExist,
          email: emailExist,
        },
        error: 'Conflict',
      });
    }
  }
}
