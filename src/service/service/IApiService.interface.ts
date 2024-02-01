import { AxiosResponse, CancelToken } from "axios";

export interface IApiService {
    get: (endpoint: string, signal: CancelToken, jwt?: string) => Promise<AxiosResponse<any, any>>;
    post: (endpoint: string, signal: CancelToken, jwt?: string, body?: Record<string, any>) => Promise<AxiosResponse<any, any>>;
    put: (endpoint: string, signal: CancelToken, jwt: string, body?: Record<string, any>) => Promise<AxiosResponse<any, any>>;
    delete: (endpoint: string, signal: CancelToken, jwt: string) => Promise<AxiosResponse<any, any>>;
}
