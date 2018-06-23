const NODE_ENV = process.env.NODE_ENV;

export function isProd(): boolean {
  return NODE_ENV === "production";
}

export function isDev(): boolean {
  return NODE_ENV === "development";
}

export function isLocal(): boolean {
  return NODE_ENV === "local";
}
