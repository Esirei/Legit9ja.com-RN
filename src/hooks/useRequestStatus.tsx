import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeRequestStatusSelector, RequestStatus } from '@selectors/makeRequestStatusSelector';

export const useRequestStatus = (selector: (state) => any): RequestStatus => {
  const select = useMemo(() => makeRequestStatusSelector(selector), [selector]);
  return useSelector(select);
};

export default useRequestStatus;
