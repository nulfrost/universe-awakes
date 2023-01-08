import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Testing each awake route", () => {
  test("all", async ({ page }) => {
    expect(page.url()).toBe("http://localhost:3000/");
  });
  test("bow", async ({ page }) => {
    await page.getByRole("link", { name: "bow" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=bow");
    expect(page.getByRole("heading", { name: "Ice Arrow" }));
  });
  test("wand", async ({ page }) => {
    await page.getByRole("link", { name: /wand/i }).first().click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=wand");
    expect(page.getByRole("heading", { name: "Maximum Crisis" }));
  });
  test("Wands and Staves", async ({ page }) => {
    await page.getByRole("link", { name: "wands and staves" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=wandorstaff");
    expect(page.getByRole("heading", { name: "Wind Cutter" }));
  });
  test("Staff", async ({ page }) => {
    await page.getByRole("link", { name: "staff" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=staff");
    expect(page.getByRole("heading", { name: "Meteo Shower" }));
  });
  //
  test("Swords and Axes", async ({ page }) => {
    await page.getByRole("link", { name: "swords and axes" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=swordoraxe");
    expect(page.getByRole("heading", { name: "Sonic Blade" }));
  });
  test("Shield", async ({ page }) => {
    await page.getByRole("link", { name: "shield" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=shield");
    expect(page.getByRole("heading", { name: "block" }));
  });
  test("Yoyo", async ({ page }) => {
    await page.getByRole("link", { name: "yoyo" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=yoyo");
    expect(page.getByRole("heading", { name: "Deadly swing" }));
  });
  test("Stick", async ({ page }) => {
    await page.getByRole("link", { name: "stick" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=stick");
    expect(page.getByRole("heading", { name: "Moon Beam" }));
  });
  test("Knuckle", async ({ page }) => {
    await page.getByRole("link", { name: "knuckle" }).click();
    expect(page.url()).toBe("http://localhost:3000/?weaponType=knuckle");
    expect(page.getByRole("heading", { name: "Bgvur Tialbold" }));
  });
});
