export const fetcher = async <T,>(
  url: string
): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("FETCH_FAILED");
  }

  return res.json() as Promise<T>;
};
