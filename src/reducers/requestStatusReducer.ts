import { AnyAction } from 'redux';

export type RequestState = { inRequest: boolean; error: any };

interface RequestReducer<S> {
  (state: S, action: AnyAction): S & RequestState;
}

type PayloadMergeFn<R> = (response: R, prev: R) => R;

// key: the key of the response in the state
export function requestStatusReducer<S>(key: string): RequestReducer<S>;

// if key is defined, the prev parameter of mergeFn is the value of the key in the current state else the whole state
export function requestStatusReducer<T, S>(
  key: string | undefined,
  mergeFn: PayloadMergeFn<T>,
): RequestReducer<S>;

export function requestStatusReducer(key?, mergeFn?) {
  if (!key && !mergeFn) {
    throw 'A key, mergeFn, or key and mergeFn must be defined';
  }

  const initialState = {
    inRequest: false,
    error: null,
  };

  return (state = initialState, action) => {
    const { type, payload, error } = action;
    const matches = /.*_(REQUEST|SUCCESS|FAILURE)/.exec(type);
    if (matches) {
      const [, requestState] = matches;
      switch (requestState) {
        case 'REQUEST':
          return { ...state, inRequest: true, error: null };
        case 'SUCCESS':
          return {
            ...state,
            inRequest: false,
            ...response(state, payload, key, mergeFn),
          };
        case 'FAILURE':
          return { ...state, inRequest: false, error };
        default:
          return state;
      }
    }
    return state;
  };
}

const response = (state, payload, key, mergeFn) => {
  return key
    ? { [key]: mergeFn ? mergeFn(payload, state[key]) : payload }
    : mergeFn(payload, state);
};

export default requestStatusReducer;
