// singleton
export class HttpRequestManager {

  public async get<T>(url: string): Promise<T> {
    return fetch(url).then((response) => response.json() as T);
  }

  public async post<T>(url: string, data: unknown): Promise<T> {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json() as T);
  }

  public async put<T>(url: string, data: unknown): Promise<T> {
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json() as T);
  }

  public async delete<T>(url: string): Promise<T> {
    return fetch(url, {
      method: "DELETE",
    }).then((response) => response.json() as T);
  }
}