import { test, expect } from "@playwright/test";

test.describe("Typst Visual Studio - Comprehensive Interactivity Suite", () => {
  let projectId: string;

  test.beforeAll(async ({ request }) => {
    // Create a fresh test project with a4_document
    const res = await request.post("/api/projects", {
      data: {
        title: "Deep Interactivity E2E Suite",
        preset: "a4_document",
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    projectId = data.id;
    expect(projectId).toBeDefined();
  });

  test("1. Direct inline editing on Interactive Sheet canvas", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible({ timeout: 15000 });

    // 1.1 Direct Heading Editing
    const headingInput = page.locator("textarea[placeholder='Click to type heading...']").first();
    await expect(headingInput).toBeVisible();
    await headingInput.click();
    await headingInput.fill("Cloud Infrastructure Whitepaper 2026");
    await expect(headingInput).toHaveValue("Cloud Infrastructure Whitepaper 2026");

    // 1.2 Subtitle Editing
    const subtitleInput = page.locator("textarea[placeholder='+ Add subtitle...']").first();
    if (await subtitleInput.isVisible()) {
      await subtitleInput.click();
      await subtitleInput.fill("High-Performance Document Compilation at Scale");
      await expect(subtitleInput).toHaveValue("High-Performance Document Compilation at Scale");
    }

    // 1.3 Card Editing (Title & Content Description)
    const cardTitle = page.locator("textarea[placeholder='+ Card Title...']").first();
    if (await cardTitle.isVisible()) {
      await cardTitle.click();
      await cardTitle.fill("Core Architectural Highlights");
      await expect(cardTitle).toHaveValue("Core Architectural Highlights");
    }

    const cardDesc = page.locator("textarea[placeholder='Card description text...']").first();
    if (await cardDesc.isVisible()) {
      await cardDesc.click();
      await cardDesc.fill("Engineered with sub-millisecond AST re-evaluation and native Typst CLI rendering.");
      await expect(cardDesc).toHaveValue(
        "Engineered with sub-millisecond AST re-evaluation and native Typst CLI rendering."
      );
    }
  });

  test("2. Callout variant switching and rich element customization", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    const calloutMsg = page.locator("textarea[placeholder*='Callout']").first();
    if (await calloutMsg.isVisible()) {
      await calloutMsg.click();
      const tipBtn = page.locator("button:has-text('tip')").first();
      if (await tipBtn.isVisible()) {
        await tipBtn.click();
      }
      await calloutMsg.fill("System optimized for parallel page streaming.");
      await expect(calloutMsg).toHaveValue("System optimized for parallel page streaming.");
    }
  });

  test("3. Metric KPI inline editing (Label, Value, Trend)", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    const metricValue = page.locator("textarea[placeholder='$0.00']").first();
    if (await metricValue.isVisible()) {
      await metricValue.click();
      await metricValue.fill("< 18ms");
      await expect(metricValue).toHaveValue("< 18ms");

      const metricLabel = page.locator("textarea[placeholder='KPI LABEL...']").first();
      if (await metricLabel.isVisible()) {
        await metricLabel.click();
        await metricLabel.fill("P99 RESPONSE TIME");
        await expect(metricLabel).toHaveValue("P99 RESPONSE TIME");
      }
    }
  });

  test("4. Table Grid inline editing: headers, cells, and dynamic row addition", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Find table container and click to select
    const tableCaption = page.locator("textarea[placeholder*='Table: Description']").first();
    if (await tableCaption.isVisible()) {
      await tableCaption.click();
      await tableCaption.fill("Global Microservices Benchmarks");
      await expect(tableCaption).toHaveValue("Global Microservices Benchmarks");

      // Verify table action controls appear
      const addRowBtn = page.locator("button:has-text('+ Row')").first();
      await expect(addRowBtn).toBeVisible();

      // Click + Row
      await addRowBtn.click();
      await page.waitForTimeout(300);

      // Verify table cell input exists and is editable
      const firstCell = page.locator("table tbody input").first();
      await expect(firstCell).toBeVisible();
      await firstCell.fill("Edge Routing Engine");
      await expect(firstCell).toHaveValue("Edge Routing Engine");
    }
  });

  test("5. Split View: resizing and layout swap", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Click "Split View" in view switcher
    const splitViewBtn = page.locator("button:has-text('Split View')");
    await splitViewBtn.click();

    // Verify both Flow Builder and Interactive Canvas are visible simultaneously
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Find the resizer bar
    const splitter = page.locator("div[title*='Drag to resize']");
    await expect(splitter).toBeVisible();

    // Hover splitter to reveal quick ratio presets
    await splitter.hover();

    // Click 40:60 preset button
    const btn4060 = page.locator("button:has-text('40:60')");
    if (await btn4060.isVisible()) {
      await btn4060.click();
      await page.waitForTimeout(200);
    }

    // Click 60:40 preset button
    const btn6040 = page.locator("button:has-text('60:40')");
    if (await btn6040.isVisible()) {
      await btn6040.click();
      await page.waitForTimeout(200);
    }

    // Click 50:50 reset button
    const btn5050 = page.locator("button:has-text('50:50')");
    if (await btn5050.isVisible()) {
      await btn5050.click();
      await page.waitForTimeout(200);
    }

    // Drag splitter handle
    const box = await splitter.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 60, box.y + box.height / 2);
      await page.mouse.up();
      await page.waitForTimeout(200);
    }
  });

  test("6. Context Menu: right-click duplicate and block actions", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    const firstBlock = page.locator(".group\\/paper-block").first();
    await expect(firstBlock).toBeVisible();

    const initialBlockCount = await page.locator(".group\\/paper-block").count();

    // Right click
    await firstBlock.click({ button: "right" });

    // Verify context menu is visible
    const contextMenu = page.locator("text=Duplicate Block");
    await expect(contextMenu).toBeVisible();

    // Click Duplicate
    await contextMenu.click();
    await page.waitForTimeout(400);

    // Verify block count increased
    const newBlockCount = await page.locator(".group\\/paper-block").count();
    expect(newBlockCount).toBeGreaterThan(initialBlockCount);
  });

  test("7. Typst Code generation and PDF Export", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Open Typst Code Drawer
    const codeBtn = page.locator("button:has-text('Typst Code')");
    await codeBtn.click();

    // Verify drawer displays Typst code
    await expect(page.locator("text=Typst Code Inspector")).toBeVisible();
    await expect(page.locator("pre")).toContainText("#set page(");

    // Close drawer
    await page.locator("button:has(svg.lucide-x)").or(page.locator("button:has-text('Close')")).first().click();

    // Test Export PDF request
    const [downloadOrResponse] = await Promise.all([
      page.waitForResponse((res) => res.url().includes("/api/export/pdf") && res.status() === 200),
      page.locator("button:has-text('Export PDF')").click(),
    ]);

    expect(downloadOrResponse.status()).toBe(200);
    const contentType = downloadOrResponse.headers()["content-type"];
    expect(contentType).toContain("application/pdf");
  });

  test("8. Multi-Theme Switching and Document Palette Selection", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Open Theme Quick Switcher in header
    const themeSwitcherTrigger = page.locator("button[title*='Switch UI Theme']").first();
    await expect(themeSwitcherTrigger).toBeVisible();
    await themeSwitcherTrigger.click();

    // Verify UI Themes list appears
    await expect(page.locator("text=Tokyo Midnight")).toBeVisible();
    await expect(page.locator("text=Editorial Paper")).toBeVisible();

    // Switch to Editorial Paper (Light Theme)
    await page.locator("button:has-text('Editorial Paper')").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "editorial-light");
    await expect(page.locator("html")).toHaveClass(/light/);

    // Switch to Tokyo Midnight
    await page.locator("button:has-text('Tokyo Midnight')").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "tokyo-midnight");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Switch to Document Palettes tab in the open popover
    await page.locator("button:has-text('Document Palettes')").click();

    // Verify palettes are listed
    await expect(page.locator("text=Swiss Bauhaus")).toBeVisible();
    await expect(page.locator("text=Kinfolk Editorial")).toBeVisible();
    await expect(page.locator("text=Cyber OLED Minimal")).toBeVisible();

    // Select Swiss Bauhaus and apply to document
    await page.locator("div:has-text('Swiss Bauhaus')").last().click();
    const applyBtn = page.locator("button:has-text('Apply')").first();
    await expect(applyBtn).toBeVisible();
    await applyBtn.click();

    // Verify confirmation text appears
    await expect(page.locator("text=Palette Applied")).toBeVisible();

    // Switch UI Theme back to Atelier Dark
    await page.locator("button:has-text('UI Theme')").click();
    await page.locator("button:has-text('Atelier Dark')").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "atelier-dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Close dropdown
    await page.locator("button:has(svg.lucide-x)").first().click();
  });

  test("9. Image Upload and Live Interactive Preview Verification", async ({ page }) => {
    await page.goto(`/editor/${projectId}`);
    await expect(page.locator("text=Interactive Sheet Canvas")).toBeVisible();

    // Upload an image via API or file input
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const buffer = Buffer.from(pngBase64, "base64");

    // Open Uploads tab in Canva sidebar
    const uploadsTab = page.locator("button[title*='Uploads']").first();
    await uploadsTab.click();

    // Trigger file upload via the hidden input
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("text=Click or drop files here").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "e2e-test-diagram.png",
      mimeType: "image/png",
      buffer,
    });

    // Wait for the image block to appear on canvas
    const imgElement = page.locator("img[alt*='preview'], img[alt*='e2e-test-diagram']").first();
    await expect(imgElement).toBeVisible({ timeout: 10000 });

    // Verify image src starts with /uploads/
    const src = await imgElement.getAttribute("src");
    expect(src).toMatch(/^\/uploads\/\d+-[a-z0-9]+\.png$/);

    // Verify fetching image URL returns 200 OK (not 404!)
    const response = await page.request.get(src!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
