// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import auth from './hooks/auth';
import identifier from './hooks/identifier';
import metadata from './hooks/metadata';
import timestamp from './hooks/timestamp';
import acl from './acl';
import bool_cast from './hooks/bool_cast';
import validate from './hooks/validate';

export default {
  // !! order matters
  before: {
    all: [auth({acl})],
    find: [identifier, bool_cast],
    get: [identifier, bool_cast],
    create: [validate, bool_cast, metadata, timestamp, identifier],
    update: [validate, bool_cast, metadata, timestamp, identifier],
    patch: [],
    remove: [identifier],
  },

  after: {
    all: [],
    find: [identifier],
    get: [identifier],
    create: [metadata, identifier],
    update: [metadata, identifier],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
