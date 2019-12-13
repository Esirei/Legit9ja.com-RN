import reducers from '@reducers';
export * from './post';

export type AppState = ReturnType<typeof reducers>;
