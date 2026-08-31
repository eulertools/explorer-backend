/**
 * This middleware enables a way to call a service's methods by distinguishing
 * the source of such call. Knowing whether a call is made from a user's request
 * or via an internal mechanism, to help us determine the execution level.
 *
 * The 'internalKey' set here will be present in a service method's params.
 */
import { Application } from '../declarations';
import { v4 } from 'uuid';

export function internal(app: Application): void {
  // set a key used to bypass auth hooks during internal service calls
  app.set('internalKey', v4());
}
