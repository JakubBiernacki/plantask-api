import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './entities/organization.entity';
import { BaseService } from '../../common/base/base.service';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {
    super(organizationModel);
  }
}
