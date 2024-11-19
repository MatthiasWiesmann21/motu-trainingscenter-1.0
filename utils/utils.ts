export const isServer = () => typeof window === "undefined";

export const updateQueryParams = (
  newParams: { [key: string]: string },
  replace: any
) => {
  const params = new URLSearchParams(window.location.search);

  Object.entries(newParams).forEach(([key, value]) => {
    params.set(key, value);
  });

  // Update the URL with the new query params
  replace(`?${params.toString()}`);
};
