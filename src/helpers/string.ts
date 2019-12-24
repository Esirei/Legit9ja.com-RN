import { Html5Entities } from 'html-entities';

const entities = new Html5Entities();

export const htmlDecode = (string): string => entities.decode(string);

const stringTagsRegex = /(<([^>]+)>)/g;
export const stringHtmlTags = (string: string): string => string.replace(stringTagsRegex, '');
