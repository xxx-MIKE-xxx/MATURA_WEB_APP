function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

export function getAssetUrl(storagePath: string, bucket: string) {
  if (!storagePath) {
    return "";
  }

  if (
    storagePath.startsWith("http://") ||
    storagePath.startsWith("https://") ||
    storagePath.startsWith("/")
  ) {
    return storagePath;
  }

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!projectUrl) {
    return storagePath;
  }

  return `${projectUrl.replace(/\/$/, "")}/storage/v1/object/public/${trimSlashes(bucket)}/${trimSlashes(storagePath)}`;
}
