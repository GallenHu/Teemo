interface DefaultOptionsInit extends RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';
  headers?: HeadersInit;
  body?: BodyInit;
}

/*
// Usage:
const request = new FetchUtils('https://jsonplaceholder.typicode.com');

request
  .post<{ title: string; body: string; userId: number }>('/posts', {
    body: JSON.stringify({ title: 'My post title', body: 'lorem ipsum', userId: 1 }),
    headers: { Authorization: 'Bearer xxxxxxxx' },
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
*/

export class FetchUtils {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(url: string, options: DefaultOptionsInit = {}): Promise<T> {
    const defaultOptions: DefaultOptionsInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...options.headers },
    };

    const response = await fetch(`${this.baseURL}${url}`, mergedOptions);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as T;
    return data;
  }

  async get<T>(url: string, options?: DefaultOptionsInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, options?: DefaultOptionsInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST' });
  }

  async put<T>(url: string, options?: DefaultOptionsInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT' });
  }

  async delete<T>(url: string, options?: DefaultOptionsInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}
