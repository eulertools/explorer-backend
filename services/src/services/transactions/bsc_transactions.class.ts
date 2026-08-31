import { DynamoDataService } from '../dynamo_data_service';
import { Params } from '@feathersjs/feathers';

export class BscTransactions extends DynamoDataService {
  async create(data: any, params: Params | undefined): Promise<any> {
    // process subscription payment, if any
    const processed = await this.app
      .service('subscriptions')
      .processTransaction(data, params);

    if (processed) {
      const transaction = await super.create(data, params);
    }

    return true;
  }
}
