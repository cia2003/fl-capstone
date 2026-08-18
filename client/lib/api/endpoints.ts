export const GHIBLI_API_BASE_URL = "https://ghibliapi.dev";
export const filmEndpoint = (id?: string) => `${GHIBLI_API_BASE_URL}/films${id ? `/${id}` : ""}`;
