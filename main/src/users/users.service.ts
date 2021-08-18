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
import { CreateUserInput } from './dto/create-user.input';
import { BaseService } from '../common/services/base.service';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(userModel);
  }

  login(user) {
    return this.authService.login(user);
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  findByUsernameWithPassword(username: string) {
    return this.findByUsername(username).select('+password');
  }

  findByCompany(company: Company) {
    return this.userModel.find({ company });
  }

  async create(createUserDto: CreateUserInput) {
    await this.isUserUnique(createUserDto);
    const hashPass = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPass,
    });
    delete user.password;
    return user;
  }

  async isUserUnique({ username, email }: CreateUserInput) {
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
