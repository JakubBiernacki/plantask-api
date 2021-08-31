import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersResolver } from './users.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    forwardRef(() => ProjectsModule),
    InvitationsModule,
    PubSubModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
