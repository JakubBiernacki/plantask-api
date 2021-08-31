import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput } from './dto/create-user.input';
import { BaseService } from '../../common/base/base.service';
import { ErrorsMessages } from '../../constants';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private authService: AuthService,
  ) {
    super(userModel);
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  findOneByUsernameWithPassword(username: string) {
    return this.findOneByUsername(username).select('+password');
  }

  findByOrganization(organization) {
    return this.userModel.find({ organization });
  }

  findByIds(usersIds: string[]) {
    return this.userModel.find({ _id: { $in: usersIds } });
  }

  async getOrganizationByUser(user: User) {
    return (await this.userModel.findOne(user).populate('organization'))
      .organization;
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
          username: usernameExist && ErrorsMessages.USERNAME_EXIST,
          email: emailExist && ErrorsMessages.EMAIL_EXIT,
        },
        error: 'Conflict',
      });
    }
  }
}
