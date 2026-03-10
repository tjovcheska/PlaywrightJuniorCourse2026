import test, { expect } from "@playwright/test";
import users from "../fixtures/users.json"
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.describe("[WEB] Login functionallity", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to SauceDemo
        await page.goto("");
        await expect(page).toHaveTitle("Swag Labs");

        loginPage = new LoginPage(page)
        inventoryPage = new InventoryPage(page)
    });

    Object.values(users).forEach(user => {
        test(`Login with ${user.username}`, async () => {
            // Login
            await loginPage.fillLoginForm(user.username, user.password)
            await loginPage.clickLoginButton();
            if (user.expectedResult === "success") {
                await inventoryPage.assertInventoryPageTitle('Products')
            }
        });
    });

    test("Login with invalid credentials", async () => {
        await loginPage.fillLoginForm(users.invalidUser.username, users.invalidUser.password)

        // Validate that error icons are not attached
        await loginPage.validateErrorIconsAttached(false)

        // Click Login button
        await loginPage.clickLoginButton()

        // Validate error message
        await loginPage.validateErrorMessageAttached()
        await loginPage.validateErrorMessageText("Epic sadface: Username and password do not match any user in this service")

        // Validate that error icons are attached
        await loginPage.validateErrorIconsNthAttached(0)
        await loginPage.validateErrorIconsNthAttached(1)

        // Click close error button
        await loginPage.clickCloseErrorButton()

        // Validate that error icons are not attached
        await loginPage.validateErrorIconsVisible(false)

        // Validate that error message card is not attached TODO: Uncomment when handled properly on th UI
        // await expect(page.locator('.error-message-container')).not.toBeVisible()
    });

    test("Login in with locked_out_user", async () => {
        await loginPage.fillLoginForm(users.lockedOutUser.username, users.lockedOutUser.password)
        await loginPage.clickLoginButton()

        // Validate error message
        await loginPage.validateErrorMessageText("Epic sadface: Sorry, this user has been locked out.")
    });
});

test.describe("[MOBILE] Login functionallty", () => {

    let mobilePage;
    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 660 },
            isMobile: true
        });

        mobilePage = await context.newPage()

        // Navigate to SauceDemo
        await mobilePage.goto("")
        await expect(mobilePage).toHaveTitle("Swag Labs")
    });

    test("Login in with locked_out_user on mobile", async ({ page, browser }) => {
        // Login
        await mobilePage.fill("#user-name", users.lockedOutUser.username)
        await mobilePage.fill("#password", users.lockedOutUser.password)
        await mobilePage.getByTestId('login-button').click()

        // Validate error message
        await expect(mobilePage.getByTestId('error')).toHaveText("Epic sadface: Sorry, this user has been locked out.")
    });

    test("Login in with invalid credentials on mobile", async ({ page, browser }) => {
        // Login
        await mobilePage.fill("#user-name", users.invalidUser.username)
        await mobilePage.fill("#password", users.invalidUser.password)
        await mobilePage.getByTestId('login-button').click()

        // Validate error message
        await expect(mobilePage.getByTestId('error')).toHaveText("Epic sadface: Username and password do not match any user in this service")
    });
});
