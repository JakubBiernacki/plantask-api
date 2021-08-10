import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Task } from '../tasks/entities/task.entity';
import { PaginationArgs } from '../common/dto/pagination.args';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ) {
    return this.projectsService.create(createProjectInput);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll(@Args() pagination: PaginationArgs) {
    const { limit, offset } = pagination;
    return this.projectsService.findAll().limit(limit).skip(offset);
  }
  @Query(() => Project, { name: 'project' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.projectsService.findOne(id);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectsService.update(
      updateProjectInput.id,
      updateProjectInput,
    );
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => ID }) id: string) {
    return this.projectsService.remove(id);
  }

  @ResolveField('tasks', () => [Task])
  getTasks(@Parent() project: Project, @Args() pagination: PaginationArgs) {
    const { limit, offset } = pagination;
    return this.projectsService
      .getTasksByProjectId(project)
      .limit(limit)
      .skip(offset);
  }
}
