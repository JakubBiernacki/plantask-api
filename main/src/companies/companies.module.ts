import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [CompaniesResolver, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
