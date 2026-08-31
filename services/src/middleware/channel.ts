/**
 * This middleware will allow a service's channel to redirect the event to
 * the original owner of a referenced document, if item_ref is present in
 * the request's data: item_ref must match an existing identifier.
 */
import { Channel } from '@feathersjs/transport-commons/lib/channels/channel/base';
import pluralize from 'pluralize';

interface ChannelData {
  /**
   * The identifier of an existing document owned by someone.
   */
  item_ref?: string;
  [key: string]: any;
}

export async function channel(
  data: ChannelData,
  context: any
): Promise<Channel> {
  // by default, owner is who has triggered this event
  let userSub = context.params?.user?.user_sub;

  try {
    // retrieve related doc, if any
    const refType = data?.item_ref?.split('~')[0];
    const refId = data?.item_ref?.split('~')[1];

    if (refType) {
      const doc = await (
        context.app.service(pluralize.plural(refType)) as any
      ).get(refId, {
        // identify this call as internal
        internalKey: context.app.get('internalKey'),
      });

      // associate event with owner of doc
      userSub = doc.user_sub;
    }
  } catch (err) {}

  return context.app.channel(`${context.path}-${userSub}`);
}
