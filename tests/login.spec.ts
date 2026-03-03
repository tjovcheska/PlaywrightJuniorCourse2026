import test, { expect } from "@playwright/test";

test("Login test", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Login
    await page.fill("#user-name", "standard_user")
    await page.fill("#password", "secret_sauce")
    await page.getByTestId('login-button').click() // await page.click("[data-test='login-button']")
    await expect(page.getByTestId('title')).toHaveText('Products')
});

test("Login with invalid credentials", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Fill in username
    await page.getByTestId('username').fill("invalid_username")

    // Fill in password
    await page.getByTestId('password').fill("invalid_password")

    // Validate that error icons are not attached
    // await expect(page.locator('.error-message-container')).not.toBeAttached()
    await expect(page.locator('.error_icon')).not.toBeAttached()

    // Click Login button
    await page.locator('.submit-button').click()

    // Validate error message
    await expect(page.locator('.error-message-container')).toBeAttached()
    await expect(page.getByTestId('error')).toHaveText("Epic sadface: Username and password do not match any user in this service")

    // Validate that error icons are attached
    await expect(page.locator('.error_icon').first()).toBeAttached()
    await expect(page.locator('.error_icon').last()).toBeAttached()

    // Click close error button
    await page.getByTestId('error-button').click()

    // Validate that error icons are not attached
    await expect(page.locator('.error_icon')).not.toBeVisible()

    // Validate that error message card is not attached TODO: Uncomment when handled properly on th UI
    // await expect(page.locator('.error-message-container')).not.toBeVisible()
});

test("Login in with locked_out_user", async ({ page }) => {
    // Navigate to SauceDemo
    await page.goto("https://www.saucedemo.com/")
    await expect(page).toHaveTitle("Swag Labs")

    // Login
    await page.fill("#user-name", "locked_out_user")
    await page.fill("#password", "secret_sauce")
    await page.getByTestId('login-button').click()

    // Validate error message
    await expect(page.getByTestId('error')).toHaveText("Epic sadface: Sorry, this user has been locked out.")
});
