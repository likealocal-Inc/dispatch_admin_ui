import { useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { APIURLType } from "../constants";

export interface UseAPICallResult {
  ok: boolean;
  data: any;
}

interface UseCallAPIState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

interface UseCallAPIProps {
  url: APIURLType;
  addUrlParams?: string;
}

type UseCallAPIResult<T> = [(data?: any) => void, UseCallAPIState<T>];

/**
 * API호출 Hook
 */
export default function useCallAPI<T = any>({
  url,
  addUrlParams,
}: UseCallAPIProps): UseCallAPIResult<T> {
  const [state, setState] = useState<UseCallAPIState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function call(params?: any) {
    setState((prev) => ({ ...prev, loading: true }));

    callAPI({ urlInfo: url, params: params, addUrlParams: addUrlParams })
      .then((res: Response) => res.json().catch(() => {}))
      .then((data: any) => {
        setState((prev) => ({ ...prev, data, loading: false }));
      })
      .catch((error: any) =>
        setState((prev) => ({ ...prev, error, loading: false }))
      );
  }
  return [call, { ...state }];
}
