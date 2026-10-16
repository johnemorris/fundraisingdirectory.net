const measurementIdPattern = /^G-[A-Z0-9]+$/;

const enabledFlag = (value, name) => {
  if (value === undefined || value === "") return false;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  throw new Error(`${name} must be true, false, 1, or 0`);
};

export function createAnalyticsBuildConfig({ env = process.env, location = "development" } = {}) {
  const rawMeasurementId = env.PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  const required = location === "production" || enabledFlag(env.ANALYTICS_REQUIRED, "ANALYTICS_REQUIRED");

  if (!rawMeasurementId) {
    if (required) {
      throw new Error(
        "PUBLIC_GA_MEASUREMENT_ID is required for this build. Configure it as a Cloudflare Workers Build variable, not only as a runtime Worker variable.",
      );
    }
    return { measurementId: null, required };
  }

  if (!measurementIdPattern.test(rawMeasurementId)) {
    throw new Error("PUBLIC_GA_MEASUREMENT_ID must be a valid GA4 Measurement ID beginning with G-");
  }

  return { measurementId: rawMeasurementId, required };
}
