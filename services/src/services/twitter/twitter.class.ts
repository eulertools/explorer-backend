import { Id, Paginated, Params } from '@feathersjs/feathers';
import axios from 'axios';
import { Application } from '../../declarations';
import { AppService, Data, ServiceOptions } from '../app_service';
import Tweet from './tweet.model';
import { FeathersError } from '@feathersjs/errors';

export class Twitter extends AppService {
  protected twitter: any;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    const {
      twitter: { apiKey },
    } = app.get('external');
    this.twitter = axios.create({
      baseURL: 'https://api.twitter.com/1.1',
      headers: { Authorization: 'Bearer ' + apiKey },
      timeout: 1000,
    });
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data> | any> {
    const tweets: Tweet[] = [];
    const token = params?.query?.token;
    const account = params?.query?.account;
    const id = params?.query?.id;
    const attributes = !id
      ? [
          `q=($${token} OR @${account})`,
          'result_type=recent',
          'include_entities=true',
        ]
      : [`id=${id}`, 'include_entities=true'];

    try {
      const { data } = await this.twitter.get(
        `${!id ? 'search/tweets.json' : 'statuses/show.json'}?${attributes.join(
          '&'
        )}`
      );

      if (data.statuses) {
        data.statuses.forEach(function (value: any) {
          const {
            id_str,
            text,
            created_at,
            user,
            entities: { media = [] },
          } = value;
          const tweet = new Tweet(
            id_str,
            text,
            created_at,
            user.screen_name,
            media
          );

          tweets.push(tweet);
        });
      } else if (data) {
        return data;
      }
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return tweets;
  }

  async get(id: Id, params: Params | undefined): Promise<any> {
    const { query } = params as any;
    const tweets: Tweet[] = [];
    const attributes = [`screen_name=${id}`, `count=${query?.count || 10}`];

    try {
      const { data } = await this.twitter.get(
        `statuses/user_timeline.json?${attributes.join('&')}`
      );

      if (data) {
        data.forEach(function (value: any) {
          const {
            id_str,
            text,
            created_at,
            user,
            entities: { media = [] },
          } = value;
          const tweet = new Tweet(
            id_str,
            text,
            created_at,
            user.screen_name,
            media
          );

          tweets.push(tweet);
        });
      }
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }

    return tweets;
  }
}

export { Data };
