import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class Client {
  private httpClient: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.httpClient = axios.create(config);
    // Returns the data object of responses
    this.interceptors().response.use(response => {
      // console.log('Api response', response);
      return response;
    });
    console.log('Http client created!');
  }

  setDefaultConfig = (config: AxiosRequestConfig) => {
    this.httpClient.defaults = { ...this.httpClient.defaults, ...config };
    return this;
  };

  clearConfig = () => {
    this.httpClient.defaults = {};
    return this;
  };

  interceptors = () => this.httpClient.interceptors;

  // AxiosResponse data is returned using the interceptor in the constructor, hence <R, R> is used to override AxiosResponse type here.
  request = <R = any>(config: AxiosRequestConfig) => this.httpClient.request<R>(config);

  delete = <R = any>(url: string, params?: any) => this.httpClient.delete<R>(url, { params });

  get = <R = any>(url: string, params?: any) => this.httpClient.get<R>(url, { params });

  patch = <R = any>(url: string, data?: any) => this.httpClient.patch<R>(url, data);

  post = <R = any>(url: string, data?: any) => this.httpClient.post<R>(url, data);

  put = <R = any>(url: string, data?: any) => this.httpClient.put<R>(url, data);
}
