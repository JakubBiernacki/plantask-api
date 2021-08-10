import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { Task, TaskSchema } from './entities/task.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DateScalar } from '../common/scalars/date.scalar';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    ProjectsModule,
  ],
  providers: [TasksResolver, TasksService, DateScalar],
  exports: [TasksService],
})
export class TasksModule {}
