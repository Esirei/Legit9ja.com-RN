import { Platform } from 'react-native';
import { AxiosRequestConfig } from 'axios';
import Client from './client';

// Modify file as needed. (❁´◡`❁)

export interface Error {
  message: string;
  errors?: { [key: string]: string[] };
}

const clientConfig: AxiosRequestConfig = {
  baseURL: 'https://legit9ja.com/wp-json/wp/v2/',
  headers: {
    'User-Agent': Platform.OS === 'ios' ? 'iOS' : 'Android',
    Expires: '-1',
    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
  },
};

const client = new Client(clientConfig);

export default client;
