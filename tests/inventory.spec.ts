import test, { expect } from "@playwright/test"
import users from "../fixtures/users.json"
import { LoginPage } from "../pages/LoginPage"
import { InventoryPage } from "../pages/InventoryPage"
import { Navigation } from "../pages/Navigation"

let loginPage: LoginPage
let inventoryPage: InventoryPage
let navigation: Navigation

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    inventoryPage = new InventoryPage(page)
    navigation = new Navigation(page)

    // Navigate to SauceDemo
    await navigation.navigateToUrl("")
    await loginPage.assertLoginPageTitle("Swag Labs")

    // Login
    await loginPage.fillLoginForm(users.validUser.username, users.validUser.password)
    await loginPage.clickLoginButton()
    await inventoryPage.assertInventoryPageTitle('Products')
})

test.describe("Inventory page verification", async () => {
    test("Verify all products are visible", async ({ page }) => {
        await inventoryPage.verifyAllProductsVisible(6)
    })
})

test.describe("Inventory page validation", () => {
    test("Product name should match in inventory and cart page", async ({ page }) => {
        // Store item title on inventory page
        const sauceLabsBackpak = page.locator('.inventory_item').first()
        const sauceLabsBackpakName = await sauceLabsBackpak.getByTestId('inventory-item-name').textContent()
        const sauceLabsBackpakDesc = await sauceLabsBackpak.getByTestId('inventory-item-desc').textContent()

        // Click Add to cart
        await page.getByRole('button', { name: 'Add to cart'}).first().click()
        await expect(page.getByRole('button', { name: 'Remove'})).toBeVisible()

        // Click shopping cart badge
        await page.getByTestId('shopping-cart-link').click()
        await expect(page.getByTestId('title')).toHaveText('Your Cart')

        // Store item title on cart page
        const cartSauceLabsBackpakName = await page.getByTestId('inventory-item-name').textContent()
        const cartSauceLabsBackpakDesc = await page.getByTestId('inventory-item-desc').textContent()

        // Validate names match
        expect(cartSauceLabsBackpakName).toBe(sauceLabsBackpakName)
        expect(cartSauceLabsBackpakDesc).toBe(sauceLabsBackpakDesc)
    })
})

test.describe("Sorting tests", () => {
    test("Sort inventory items - Low to High", async ({ page }) => {
        await inventoryPage.verifyInventoryPageUrl('inventory.html')
        await inventoryPage.selectOptionFromDropdown('lohi')
        await inventoryPage.validateSorting()
    })

    // TODO: Implement other soring tests
})

test.describe("Adding products to cart", () => {
    test('Add all product to cart', async () => {
        await inventoryPage.addAllProductsToCart()
        await inventoryPage.goToCart()
    })
})

