import internal from '../../hooks/internal';

const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [internal],
    update: [internal],
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
