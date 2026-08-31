/**
 * ACL definitions.
 */

import { User } from '../models/user.model';
import { HookContext } from '../app';
import anything from './rules/anything.rule';
import { SubscriptionSettings } from '../models/subscription_settings.model';

export interface Rule {
  /**
   * The name of the rule.
   */
  name: string;
  /**
   * The error message that is shown when the allow method returns false.
   */
  error: string;
  /**
   * This method acts as a gate that will either allow or deny a request to go thru if certain
   * conditions are met (or not), by returning true or false respectively.
   *
   * @param  {User} user
   * @param  {HookContext} context
   * @param  {SubscriptionSettings[]} settings
   * @returns Promise
   */
  allow(
    user: User,
    context: HookContext,
    settings: SubscriptionSettings[]
  ): Promise<boolean>;
}

export interface RuleConstraints {
  rules: Rule[];
}

export interface RuleDefinition {
  [key: string]: RuleConstraints;
}

export interface AclRule {
  service: string;
  methods: RuleDefinition;
}

const rules: AclRule[] = [
  {
    service: 'bsc_transactions',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'notifications',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'wallets',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'favorites',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'alerts',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'portfolios',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'profiles',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'accounts',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'subscriptions',
    methods: {
      find: {
        rules: [anything],
      },
      get: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
    },
  },
  {
    service: 'voting',
    methods: {
      create: {
        rules: [anything],
      },
      update: {
        rules: [anything],
      },
      remove: {
        rules: [anything],
      },
    },
  },
];

export default rules;
