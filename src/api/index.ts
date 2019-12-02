import { Platform } from 'react-native';
import { AxiosRequestConfig } from 'axios';
import Client from './client';

// Modify file as needed. (❁´◡`❁)

export interface Error {
  message: string;
  errors?: { [key: string]: string[] };
}

const clientConfig: AxiosRequestConfig = {
  baseURL: 'https://reqres.in/api/',
  headers: { 'User-Agent': Platform.OS === 'ios' ? 'iOS' : 'Android' },
};

const client = new Client(clientConfig);

export default client;
