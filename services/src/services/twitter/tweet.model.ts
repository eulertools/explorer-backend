import { Data } from './twitter.class';

const URL_TWEET = 'https://twitter.com/i/web/status/';

class Tweet implements Data {
  public id: string;
  public timestamp: string;
  public user: string;
  public url: string;
  public media: any[];
  public content: string;

  public constructor(
    id: string,
    content: string,
    timestamp: string,
    user: string,
    media: any[] = []
  ) {
    this.id = id;
    this.content = content;
    this.timestamp = timestamp;
    this.user = user;
    this.url = URL_TWEET + id;
    this.media = media;
  }
}

export default Tweet;
