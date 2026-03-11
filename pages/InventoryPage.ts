import test, { expect, Locator, Page } from "@playwright/test"

export class InventoryPage {
    private page: Page
    private inventoryPageTitle: Locator
    private dropdown: Locator
    private prices: Locator
    private inventoryItem: Locator
    private inventoryItemName: Locator
    private inventoryItemDesc: Locator
    private inventoryItemButton: Locator
    private inventoryItemPrice: Locator
    private addToCartButtons: Locator
    private shoppingCartLink: Locator

    constructor(page: Page) {
        this.page = page
        this.inventoryPageTitle = this.page.getByTestId('title')
        this.dropdown = this.page.getByTestId('product-sort-container')
        this.prices = this.page.locator('.inventory_item_price')
        this.inventoryItem = this.page.getByTestId('inventory-item')
        this.inventoryItemName = this.page.getByTestId('inventory-item-name')
        this.inventoryItemDesc = this.page.locator('.inventory_item_desc')
        this.inventoryItemButton = this.page.locator('.btn_primary')
        this.inventoryItemPrice = this.page.getByTestId('inventory-item-price')
        this.addToCartButtons = this.page.getByRole('button', { name: 'Add to cart' })
        this.shoppingCartLink = this.page.getByTestId('shopping-cart-link')
    }

    async assertInventoryPageTitle(title: string) {
        await test.step(`Assert inventory page title is "${title}"`, async () => {
            await expect(this.inventoryPageTitle).toHaveText(title)
        })
    }

    async verifyInventoryPageUrl(endpoint: string) {
        await test.step(`Verify inventory page URL is "${endpoint}"`, async () => {
            await expect(this.page).toHaveURL(endpoint)
        })
    }

    async selectOptionFromDropdown(option: string) {
        await test.step(`Select "${option}" from dropdown`, async () => {
            await this.dropdown.selectOption(option)
        })
    }

    async validateSorting() {
        await test.step('Validate products are sorted by price ascending', async () => {
            const pricesText = await this.prices.allTextContents()

            const prices = pricesText.map(price => Number(price.replace('$', '')))
            const sortedPrices = [...prices].sort((a, b) => a - b)

            expect(prices).toEqual(sortedPrices)
        })
    }

    async addAllProductsToCart() {
        await test.step('Add all products to cart', async () => {
            const count = await this.addToCartButtons.count()
            for (let i = 0; i < count; i++) {
                await this.addToCartButtons.first().click()
            }
        })
    }

    async goToCart() {
        await test.step('Go to cart', async () => {
            await this.shoppingCartLink.click()
        })
    }

    async verifyAllProductsVisible(maxProductsPerPage: number) {
        await test.step(`Verify all ${maxProductsPerPage} products are visible`, async () => {
            for (let i = 0; i < maxProductsPerPage; i++) {
                await expect(this.inventoryItem.nth(i)).toBeVisible()
                await expect(this.inventoryItemName.nth(i)).toBeVisible()
                await expect(this.inventoryItemDesc.nth(i)).toBeVisible()
                await expect(this.inventoryItemButton.nth(i)).toBeVisible()
                await expect(this.inventoryItemPrice.nth(i)).toBeVisible()
            }
        })
    }
}
