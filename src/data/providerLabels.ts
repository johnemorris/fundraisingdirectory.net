const LABEL_OVERRIDES: Record<string, string> = {
  "pto-pta": "PTO/PTA",
  "peer-to-peer": "Peer-to-peer",
  "pledge-athon": "Pledge-a-thon",
  "us-nationwide": "US nationwide",
  "us-regional": "US regional",
  "us-state-specific": "US state-specific",
};

export const formatProviderLabel = (value: string) =>
  LABEL_OVERRIDES[value] ??
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
