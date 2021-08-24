import { Args, Query, Resolver } from '@nestjs/graphql';
import { Type, UseGuards } from '@nestjs/common';
import { IBaseService } from './base-service.interface';
import { GetIdArgs } from '../dto/getId.args';
import { PaginationArgs } from '../dto/pagination.args';
import { IsAdminGuard } from '../../modules/auth/guards/isAdmin.guard';

export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    protected constructor(private baseService: IBaseService<T>) {}

    @UseGuards(IsAdminGuard)
    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async findAll(@Args() pagination: PaginationArgs): Promise<T[]> {
      return this.baseService.findAll(pagination);
    }

    @Query(() => classRef, { name: `findOne${classRef.name}` })
    async findOne(@Args() { id }: GetIdArgs): Promise<T> {
      return this.baseService.findOne(id);
    }
  }
  return BaseResolverHost;
}
