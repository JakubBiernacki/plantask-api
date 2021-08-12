import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 12;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (user && (await this.comparePasswords(pass, user.password))) {
      delete user['_doc'].password;
      return user;
    }
    return null;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
