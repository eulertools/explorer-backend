import internal from '../../hooks/internal';
import unique from '../../hooks/unique';

const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [unique()],
    update: [],
    patch: [internal],
    remove: [internal],
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
