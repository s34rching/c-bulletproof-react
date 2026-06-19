import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class RequestHandler {
  private request: APIRequestContext;
  private baseUrl: string;
  private apiPath: string = '';
  private requestParams: Record<string, string> = {};
  private requestPayload: object = {};
  private apiHeaders: Record<string, string> = {};

  constructor(baseUrl: string, request: APIRequestContext) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  url(baseUrl: string): this {
    this.baseUrl = baseUrl;
    return this;
  }

  path(path: string): this {
    this.apiPath = path;
    return this;
  }

  params(params: Record<string, string>): this {
    this.requestParams = params;
    return this;
  }

  payload(data: object) {
    this.requestPayload = data;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.apiHeaders = headers;
    return this;
  }

  async getRequest(expectedStatus: number) {
    const targetUrl = this.getTargetUrl();
    const response: APIResponse = await this.request.get(targetUrl, {
      headers: this.apiHeaders,
    });

    expect(response.status()).toBe(expectedStatus);

    return response.json();
  }

  async postRequest(expectedStatus: number) {
    const targetUrl = this.getTargetUrl();
    const response: APIResponse = await this.request.post(targetUrl, {
      data: this.requestPayload,
      headers: this.apiHeaders,
    });

    this.resetHandler();

    expect(response.status()).toBe(expectedStatus);

    return response.json();
  }

  async putRequest(expectedStatus: number) {
    const targetUrl = this.getTargetUrl();
    const response: APIResponse = await this.request.put(targetUrl, {
      data: this.requestPayload,
      headers: this.apiHeaders,
    });

    this.resetHandler();

    expect(response.status()).toBe(expectedStatus);

    return response.json();
  }

  async deleteRequest(expectedStatus: number) {
    const targetUrl = this.getTargetUrl();
    const response: APIResponse = await this.request.delete(targetUrl, {
      headers: this.apiHeaders,
    });

    this.resetHandler();

    expect(response.status()).toBe(expectedStatus);

    return response.json();
  }

  private getTargetUrl(): string {
    const url = new URL(`${this.baseUrl}${this.apiPath}`);

    for (const [key, value] of Object.entries(this.requestParams)) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  }

  private resetHandler() {
    this.baseUrl = '';
    this.apiPath = '';
    this.requestParams = {};
    this.requestPayload = {};
    this.apiHeaders = {};
  }
}
