import { User } from '../../models/user.model';
import { HookContext } from '../../app';
import { Rule } from '../index';
import { SubscriptionSettings } from '../../models/subscription_settings.model';

/**
 * This method acts as a gate that will either allow or deny a request to go thru if certain
 * conditions are met (or not), by returning true or false respectively.
 *
 * @param  {User} user
 * @param  {HookContext} context
 * @param  {SubscriptionSettings} settings
 * @returns Promise
 */
const allow = async function (
  user: User,
  context: HookContext,
  settings: SubscriptionSettings[]
): Promise<boolean> {
  return Promise.resolve(true);
};

const rule: Rule = {
  name: 'anything',
  error: 'User is not able to do anything',
  allow,
};

export default rule;
