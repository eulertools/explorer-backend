import count from '../../hooks/count';
import unique from '../../hooks/unique';

const hooks = {
  before: {
    all: [],
    find: [count],
    get: [],
    create: [unique(['item_type', 'item_name'])],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
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

export default hooks;
