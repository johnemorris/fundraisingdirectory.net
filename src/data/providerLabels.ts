const LABEL_OVERRIDES: Record<string, string> = {
  "pto-pta": "PTO/PTA",
  "sports-athletics": "Sports Teams",
  "churches-faith": "Churches / Faith",
  "nonprofits-charities": "Nonprofits / Charities",
  "clubs-community": "Clubs / Community",
  "arts-music-performance": "Arts / Music / Performance",
  "individuals-personal-causes": "Individuals / Personal Causes",
  "events-activities": "Events & Activities",
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
