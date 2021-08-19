import { BasisTheoryService } from '../service';
import type { BasisTheoryServiceOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import type {
  Reactor,
  CreateReactorModel,
  UpdateReactorModel,
  ReactorQuery,
} from './types';
import {
  transformReactorResponseCamelCase,
  transformReactorRequestSnakeCase,
} from './../common/utils';

export const BasisTheoryReactors = new CrudBuilder(
  class BasisTheoryReactors extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      super({
        transformResponse: transformReactorResponseCamelCase,
        transformRequest: transformReactorRequestSnakeCase,
        ...options,
      });
    }
  }
)
  .create<Reactor, CreateReactorModel>()
  .retrieve<Reactor>()
  .update<Reactor, UpdateReactorModel>()
  .delete()
  .list<Reactor, ReactorQuery>()
  .build();

export type BasisTheoryReactors = InstanceType<typeof BasisTheoryReactors>;