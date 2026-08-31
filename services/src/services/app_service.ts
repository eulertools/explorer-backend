/*
 * A base service for general usage without any underlying data source.
 */
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers';
import { provider } from 'web3-core';
import { Application } from '../declarations';

export interface Data {}
export interface ServiceOptions {
  node?: provider;
  paginate?: any;
}

export class AppService implements ServiceMethods<any> {
  protected app: Application;
  protected options: ServiceOptions;

  constructor(options: ServiceOptions, app: Application) {
    this.app = app;
    this.options = options;
  }

  async find(params: Params): Promise<any[] | Paginated<any>> {
    return [];
  }

  async get(id: Id, params: Params | undefined): Promise<any> {}

  async create(data: any, params: Params | undefined): Promise<any> {
    return data;
  }

  async update(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    return data;
  }

  async patch(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    return data;
  }

  async remove(id: NullableId, params: Params | undefined): Promise<any> {
    return id;
  }

  async setup(app: Application, path: string): Promise<void> {}
}
