import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    forwardRef(() => TasksModule),
  ],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
