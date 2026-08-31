import unique from "../../hooks/unique";

const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [unique(['address', 'network'], {message: "Wallet already exists"})],
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
