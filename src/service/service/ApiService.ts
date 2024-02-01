import * as axios from "axios";
import { IApiService } from "./IApiService.interface";

class ApiService implements IApiService {
    private static _instance: ApiService | null = null;
    private _axiosInstance: axios.AxiosInstance;

    private constructor(baseURL: string) {
        this._axiosInstance = axios.default.create({
            baseURL,
            timeout: 2000,
        });
    }

    public static getInstance(): ApiService {
        if (!this._instance) {
            const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

            this._instance = new ApiService(API_ENDPOINT !== undefined ? API_ENDPOINT : "");
        }
        return this._instance;
    }

    async get(endpoint: string, cancelToken: axios.CancelToken, jwt?: String): Promise<axios.AxiosResponse<any, any>> {
        const headers = {} as any;
        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }
        return this._axiosInstance.get("api/v1/" + endpoint, { headers, withCredentials: true, cancelToken });
    }

    async post(endpoint: string, cancelToken: axios.CancelToken, jwt?: String, body?: Record<string, any>): Promise<axios.AxiosResponse<any, any>> {
        const headers = {} as any;
        if (jwt) {
            headers["Authorization"] = `Bearer ${jwt}`;
        }
        return this._axiosInstance.post("api/v1/" + endpoint, body, { headers, withCredentials: true, cancelToken });
    }

    async put(endpoint: string, cancelToken: axios.CancelToken, jwt: String, body?: Record<string, any>): Promise<axios.AxiosResponse<any, any>> {
        const headers = { Authorization: `Bearer ${jwt}` };
        return this._axiosInstance.put("api/v1/" + endpoint, body, { headers, withCredentials: true, cancelToken });
    }

    async delete(endpoint: string, cancelToken: axios.CancelToken, jwt: String): Promise<axios.AxiosResponse<any, any>> {
        const headers = { Authorization: `Bearer ${jwt}` };
        return this._axiosInstance.delete("api/v1/" + endpoint, { headers, withCredentials: true });
    }
}

export default ApiService;
