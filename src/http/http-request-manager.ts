import { secretKey } from "..";

export class HttpRequestManager {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    return response.json() as Promise<T>;
  }

  public async get<T>(url: string): Promise<T> {
    return fetch(url, { headers: { "Secret-Key": secretKey } })
      .then((response) => this.handleResponse<T>(response));
  }

  public async post<T>(url: string, data: unknown): Promise<T> {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Secret-Key": secretKey,
      },
      body: JSON.stringify(data),
    }).then((response) => this.handleResponse<T>(response));
  }

  public async put<T>(url: string, data: unknown): Promise<T> {
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Secret-Key": secretKey,
      },
      body: JSON.stringify(data),
    }).then((response) => this.handleResponse<T>(response));
  }

  public async delete<T>(url: string): Promise<T> {
    return fetch(url, {
      method: "DELETE",
      headers: { "Secret-Key": secretKey },
    }).then((response) => this.handleResponse<T>(response));
  }

  public async downloadFile(url: string): Promise<Buffer> {
    const response = await fetch(url, { headers: { "Secret-Key": secretKey } });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}