import { HookContext } from '@feathersjs/feathers';

export default function (context: HookContext): HookContext {
  const {query = null} = context.params;
  const {data = null} = context;

  console.log(context)

  if (query) {
    console.log(query);
    //    context.params.query = query;
  }

  if (data) {
    console.log("data", data)
    context.data = data;
  }

  return context;
}
