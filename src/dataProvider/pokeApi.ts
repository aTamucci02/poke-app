import type {
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  GetManyResponse,
} from "@refinedev/core";

const BASE_URL = "https://pokeapi.co/api/v2";

interface PokeItem {
  name: string;
  url: string;
}

export const pokeApiDataProvider: DataProvider = {
  getApiUrl(): string {
    return BASE_URL;
  },

  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const { resource, pagination } = params;
    const { current = 1, pageSize = 20 } = pagination ?? {};
    const offset = (current - 1) * pageSize;
    const url = `${BASE_URL}/${resource}/?limit=${pageSize}&offset=${offset}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const json = await res.json();
    const results = json.results as PokeItem[];

    const data = results.map((item) => ({
      id: item.name,
      name: item.name,
      url: item.url,
    })) as unknown as TData[];

    return {
      data,
      total: json.count as number,
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams,
  ): Promise<GetOneResponse<TData>> => {
    const { resource, id } = params;
    const res = await fetch(`${BASE_URL}/${resource}/${id}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const json = await res.json();

    const data = { id: json.name, ...json } as unknown as TData;
    return { data };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>(
  ): Promise<GetManyResponse<TData>> => ({
    data: [] as unknown as TData[],
  }),

  create:     () => Promise.reject("Not implemented"),
  update:     () => Promise.reject("Not implemented"),
  updateMany: () => Promise.reject("Not implemented"),
  createMany: () => Promise.reject("Not implemented"),
  deleteOne:  () => Promise.reject("Not implemented"),
  deleteMany: () => Promise.reject("Not implemented"),
};
