export const GHIBLI_API_BASE_URL = "https://ghibliapi.dev";

export const filmEndpoint = (
    id?: string
) => `${GHIBLI_API_BASE_URL}/films${id ? `/${id}` : ""}`;

export const entityEndpoint = (
  kind: "people" | "species" | "vehicles" | "locations",
  id?: string,
) =>
  `${GHIBLI_API_BASE_URL}/${kind}${id ? `/${id}` : ""}`