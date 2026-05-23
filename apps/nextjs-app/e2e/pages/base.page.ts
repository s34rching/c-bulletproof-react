import { expect, type Locator, type Page } from '@playwright/test';
import { generateUser } from '@/testing/data-generators';

const USER_SETTLE_TIMEOUT = 2000;

export class BasePage {
  readonly page: Page;
  readonly eventAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventAlert = page.locator('div.pointer-events-auto');
  }

  async open(path: string) {
    await this.page.goto(path);
  }

  async waitUrlContains(path: string | RegExp) {
    await this.page.waitForURL(path);
  }

  async waitForComplete(operation: string, timeout: number): Promise<void> {
    console.log(`Waiting ${timeout}ms for "${operation}" to complete`);
    await new Promise<void>((resolve) => setTimeout(resolve, timeout));
  }

  async createRegisteredUser(userData: Partial<ReturnType<typeof generateUser>>): Promise<void> {
    const { firstName, lastName, email, password, teamName } = userData;

    const response = await this.page.request.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      data: {
        firstName,
        lastName,
        email,
        password,
        teamName,
        teamId: null,
      },
    });
    expect(response.status()).toBe(200)

    await this.waitForComplete('User is being set in system', USER_SETTLE_TIMEOUT);
  }

  async resetPageState(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
