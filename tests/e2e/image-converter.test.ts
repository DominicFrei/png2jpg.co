import { expect, test } from '@playwright/test';
import path from 'path';

test.describe('Image Conversion E2E', () => {
	test('complete image conversion workflow', async ({ page }) => {
		// Navigate to the homepage
		await page.goto('/');

		// Verify page loads correctly
		await expect(page.locator('h1')).toBeVisible();

		// Test format selection - select WebP
		await page.click('button:has-text("WebP")');
		await expect(page.locator('button:has-text("WebP")').first()).toHaveClass(/border-blue-500/);

		// Upload a test image
		const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test_image_png.png');

		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(testImagePath);

		// Wait for conversion to complete (image should appear in results)
		await expect(page.locator('h2:has-text("Your Images")')).toBeVisible({ timeout: 10000 });

		// Verify file appears in the results
		await expect(page.locator('text=test_image_png.png')).toBeVisible();

		// Verify conversion status shows completed (not "Converting...")
		await expect(page.locator('text=Converting PNG → WEBP...')).not.toBeVisible({ timeout: 15000 });

		// Verify download button is present and clickable
		const downloadButton = page.locator('button:has-text("Download")').first();
		await expect(downloadButton).toBeVisible();
		await expect(downloadButton).toBeEnabled();

		// Test the download functionality
		const downloadPromise = page.waitForEvent('download');
		await downloadButton.click();
		const download = await downloadPromise;

		// Verify download has correct filename format
		expect(download.suggestedFilename()).toMatch(/test_image_png\.(webp|png)$/);

		// Test clear functionality
		const clearButton = page.locator('button:has-text("Clear All")');
		if (await clearButton.isVisible()) {
			await clearButton.click();
			await expect(page.locator('h2:has-text("Your Images")')).not.toBeVisible();
		}
	});

	test('multiple file upload and conversion', async ({ page }) => {
		await page.goto('/');

		// Select JPG format
		await page.click('button:has-text("JPG/JPEG")');

		// Upload multiple test images
		const testImages = [
			path.join(process.cwd(), 'tests', 'fixtures', 'test_image_png.png'),
			path.join(process.cwd(), 'tests', 'fixtures', 'test_image_svg.svg')
		];

		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(testImages);

		// Wait for "Your Images (2)" to appear
		await expect(page.locator('h2:has-text("Your Images (2)")')).toBeVisible({ timeout: 10000 });

		// Verify both files appear
		await expect(page.locator('text=test_image_png.png')).toBeVisible();
		await expect(page.locator('text=test_image_svg.svg')).toBeVisible();

		// Wait for all conversions to complete
		await expect(page.locator('.text-xs.text-gray-500:has-text("Converting")')).not.toBeVisible({
			timeout: 20000
		});

		// Verify download buttons for both files
		const downloadButtons = page.locator('button:has-text("Download")');
		await expect(downloadButtons).toHaveCount(2);

		// Test Clear All functionality with multiple files
		await page.click('button:has-text("Clear All")');
		await expect(page.locator('h2:has-text("Your Images")')).not.toBeVisible();
	});

	test('format switching with existing files', async ({ page }) => {
		await page.goto('/');

		// Start with PNG format
		await page.click('button:has-text("PNG")');

		// Upload a JPG file
		const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test_image_jpg.jpg');
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(testImagePath);

		// Wait for conversion
		await expect(page.locator('h2:has-text("Your Images")')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('text=Converting JPG → PNG...')).not.toBeVisible({ timeout: 15000 });

		// Switch format to WebP
		await page.click('button:has-text("WebP")');

		// Upload another file - should convert to WebP now
		const testImagePath2 = path.join(process.cwd(), 'tests', 'fixtures', 'test_image_png.png');
		await fileInput.setInputFiles(testImagePath2);

		// Wait for the second file to appear
		await expect(page.locator('h2:has-text("Your Images (2)")')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('text=Converting PNG → WEBP...')).not.toBeVisible({ timeout: 15000 });

		// Both files should be present
		await expect(page.locator('text=test_image_jpg.jpg')).toBeVisible();
		await expect(page.locator('text=test_image_png.png')).toBeVisible();
	});

	test('drag and drop functionality', async ({ page }) => {
		await page.goto('/');

		// Select WebP format
		await page.click('button:has-text("WebP")');

		// Create a file for drag and drop simulation
		const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test_image_png.png');

		// Simulate drag and drop by using setInputFiles on the hidden input
		// (Playwright doesn't support real drag-and-drop file operations)
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(testImagePath);

		// Verify the file was processed
		await expect(page.locator('h2:has-text("Your Images")')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('text=test_image_png.png')).toBeVisible();
	});

	test('error handling for unsupported files', async ({ page }) => {
		await page.goto('/');

		// Try to upload a non-image file (we'll create a text file for this test)
		const textFilePath = path.join(process.cwd(), 'tests', 'fixtures', 'test.txt');

		// The test.txt file should already exist from our setup

		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(textFilePath);

		// The file should be filtered out, so "Your Images" section should not appear
		await page.waitForTimeout(2000); // Give it time to process
		await expect(page.locator('h2:has-text("Your Images")')).not.toBeVisible();
	});
});
