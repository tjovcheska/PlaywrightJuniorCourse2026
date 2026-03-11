import test, { Page } from "@playwright/test"

export class Navigation {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async navigateToUrl(url: string) {
        await test.step(`Navigate to URL: ${url}`, async () => {
            await this.page.goto(url)
        })
    }
}