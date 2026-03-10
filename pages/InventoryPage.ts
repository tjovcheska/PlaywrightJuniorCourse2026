import { expect, Locator, Page } from "@playwright/test";

export class InventoryPage {
    private page: Page;
    private inventoryPageTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryPageTitle = this.page.getByTestId('title');
    }

    async assertInventoryPageTitle(title: string) {
        await expect(this.inventoryPageTitle).toHaveText(title)
    }
}
