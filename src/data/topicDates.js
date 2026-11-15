import { TOPIC_HUB_UPDATED, providerTopicLinkUpdates } from "./topicPublication.js";
const latest = (dates) => dates.filter(Boolean).sort().at(-1);
export function topicModificationDates(topics, providers) {
  const providerDates = new Map(providers.map((provider) => [provider.id, provider.data.meta.modified_at.slice(0, 10)]));
  return new Map([
    ["/ideas/", TOPIC_HUB_UPDATED],
    ...topics.map((topic) => [`/${topic.data.legacyPath}.html`, latest([topic.data.updated, ...topic.data.providers.map((entry) => providerDates.get(entry.provider.id))])]),
    ...providers.map((provider) => [`/providers/${provider.data.identity.slug}/`, latest([provider.data.meta.modified_at.slice(0, 10), providerTopicLinkUpdates[provider.data.identity.slug]])]),
  ]);
}
