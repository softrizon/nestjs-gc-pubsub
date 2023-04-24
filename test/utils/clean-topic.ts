import { PubSub } from '@google-cloud/pubsub';

export async function removeTopic(client: PubSub, topicName: string) {
  const topic = client.topic(topicName);
  await topic.exists().then(([exists]) => {
    if (!exists) return;

    return topic
      .getSubscriptions()
      .then(([subscriptions]) => {
        return Promise.all(subscriptions.map((subscription) => subscription.delete()));
      })
      .then(() => topic.delete());
  });
}

export async function removeSubscription(client: PubSub, subscriptionName: string) {
  const subscription = client.subscription(subscriptionName);
  await subscription.exists().then(([exists]) => {
    if (!exists) return;

    return subscription.delete();
  });
}
