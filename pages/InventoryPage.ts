import { expect, Locator, Page } from "@playwright/test";

export class InventoryPage {
    private page: Page;
    private inventoryPageTitle: Locator;
    private dropdown: Locator;
    private prices: Locator;
    private inventoryItem: Locator;
    private inventoryItemName: Locator;
    private inventoryItemDesc: Locator;
    private inventoryItemButton: Locator;
    private inventoryItemPrice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryPageTitle = this.page.getByTestId('title');
        this.dropdown = this.page.getByTestId('product-sort-container');
        this.prices = this.page.locator('.inventory_item_price')
        this.inventoryItem = this.page.getByTestId('inventory-item')
        this.inventoryItemName = this.page.getByTestId('inventory-item-name')
        this.inventoryItemDesc = this.page.locator('.inventory_item_desc')
        this.inventoryItemButton = this.page.locator('.btn_primary')
        this.inventoryItemPrice = this.page.getByTestId('inventory-item-price')
    }

    async assertInventoryPageTitle(title: string) {
        await expect(this.inventoryPageTitle).toHaveText(title)
    }

    async verifyInventoryPageUrl(endpoint: string) {
        await expect(this.page).toHaveURL(endpoint)
    }

    async selectOptionFromDropdown(option: string) {
        await this.dropdown.selectOption(option)
    }

    async validateSorting() {
        const pricesText = await this.prices.allTextContents();

        const prices = pricesText.map(price => Number(price.replace('$', '')))
        const sortedPrices = [...prices].sort((a, b) => a - b)

        expect(prices).toEqual(sortedPrices)
    }

    async verifyAllProductsVisible(maxProductsPerPage: number) {
        for (let i = 0; i < maxProductsPerPage; i++) {
            await expect(this.inventoryItem.nth(i)).toBeVisible()
            await expect(this.inventoryItemName.nth(i)).toBeVisible()
            await expect(this.inventoryItemDesc.nth(i)).toBeVisible()
            await expect(this.inventoryItemButton.nth(i)).toBeVisible()
            await expect(this.inventoryItemPrice.nth(i)).toBeVisible()
        }
    }
}
