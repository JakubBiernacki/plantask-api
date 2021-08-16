import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './entities/company.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class CompaniesService extends BaseService<Company> {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {
    super(companyModel);
  }
}
