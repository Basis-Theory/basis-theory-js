interface RequestConfig {
  headers?: Record<string, string>;
}

interface HttpClient {
  post(url: string, payload: unknown, config?: RequestConfig): Promise<unknown>;
  put(url: string, payload: unknown, config?: RequestConfig): Promise<unknown>;
  patch(
    url: string,
    payload: unknown,
    config?: RequestConfig
  ): Promise<unknown>;
  get(url: string, config?: RequestConfig): Promise<unknown>;
  delete(url: string, config?: RequestConfig): Promise<unknown>;
}

export type { HttpClient, RequestConfig };
