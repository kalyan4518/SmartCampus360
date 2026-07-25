const DEFAULT_API_URL = "http://localhost:5000";
const ROOT_BACKEND_PATHS = ["/api", "/auth", "/uploads", "/health"] as const;

const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const normalizeBasePath = (value: string) => {
  const trimmed = trimTrailingSlashes(value);
  return trimmed === "/" ? "" : trimmed;
};

const getRuntimeOrigin = () => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return DEFAULT_API_URL;
};

const resolveConfiguredApiUrl = () => {
  const configuredUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim();

  if (/^https?:\/\//i.test(configuredUrl)) {
    return new URL(configuredUrl);
  }

  if (configuredUrl.startsWith("/")) {
    return new URL(configuredUrl, getRuntimeOrigin());
  }

  return new URL(`/${configuredUrl}`, getRuntimeOrigin());
};

const parsedApiUrl = resolveConfiguredApiUrl();
const backendBasePath = normalizeBasePath(parsedApiUrl.pathname);

export const backendOrigin = parsedApiUrl.origin;
export const frontendBaseUrl = import.meta.env.BASE_URL || "/";

export const buildBackendUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const shouldUseOrigin = ROOT_BACKEND_PATHS.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  );

  if (shouldUseOrigin || !backendBasePath) {
    return `${backendOrigin}${normalizedPath}`;
  }

  return `${backendOrigin}${backendBasePath}${normalizedPath}`;
};

export const apiBaseUrl = buildBackendUrl("/api");

export const getPublicAssetUrl = (assetPath: string) =>
  `${frontendBaseUrl}${assetPath.replace(/^\/+/, "")}`;
