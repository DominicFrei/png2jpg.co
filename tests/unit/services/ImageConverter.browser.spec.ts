import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageConverter } from '$lib/services/ImageConverter';
import type { ConvertedFile, ImageFormat } from '$lib/services/ImageConverter';

// Import test images using Vitest's ?url syntax
import testImagePngUrl from '../../fixtures/test_image_png.png?url';
import testImageJpgUrl from '../../fixtures/test_image_jpg.jpg?url';
import testImageSvgUrl from '../../fixtures/test_image_svg.svg?url';

describe('ImageConverter (Browser Tests)', () => {
	let converter: ImageConverter;

	beforeEach(() => {
		converter = new ImageConverter();
	});

	describe('convertImage', () => {
		// Helper function to load test image file
		async function loadTestImage(url: string, filename: string, mimeType: string): Promise<File> {
			const response = await fetch(url);
			const blob = await response.blob();
			return new File([blob], filename, { type: mimeType });
		}

		// Test matrix: 3 input formats × 3 output formats = 9 combinations
		const testMatrix = [
			{
				filename: 'test_image_png.png',
				mimeType: 'image/png',
				format: 'PNG',
				url: testImagePngUrl
			},
			{
				filename: 'test_image_jpg.jpg',
				mimeType: 'image/jpeg',
				format: 'JPG',
				url: testImageJpgUrl
			},
			{
				filename: 'test_image_svg.svg',
				mimeType: 'image/svg+xml',
				format: 'SVG',
				url: testImageSvgUrl
			}
		];

		const outputFormats: ImageFormat[] = ['png', 'jpg', 'webp'];

		testMatrix.forEach(({ filename, mimeType, format, url }) => {
			outputFormats.forEach((outputFormat) => {
				it(`should convert ${format} to ${outputFormat.toUpperCase()}`, async () => {
					const file = await loadTestImage(url, filename, mimeType);

					const result = await converter.convertImage(file, outputFormat);

					expect(result.url).toBeDefined();
					expect(result.url).toMatch(/^blob:/);
					expect(result.size).toBeGreaterThan(0);

					// Verify the blob can be fetched and has the correct type
					const response = await fetch(result.url);
					const blob = await response.blob();
					expect(blob.size).toBe(result.size);

					// Check expected MIME type
					const expectedMimeTypes = {
						png: 'image/png',
						jpg: 'image/jpeg',
						jpeg: 'image/jpeg',
						webp: 'image/webp'
					};
					expect(blob.type).toBe(expectedMimeTypes[outputFormat]);
				});
			});
		});

		it('should handle conversion errors gracefully', async () => {
			// Create an invalid file
			const invalidBlob = new Blob(['invalid image data'], { type: 'image/png' });
			const file = new File([invalidBlob], 'invalid.png', { type: 'image/png' });

			// Should throw an error
			await expect(converter.convertImage(file, 'jpg')).rejects.toThrow();
		});
	});

	describe('downloadFile', () => {
		it('should trigger download of converted file', async () => {
			// Mock fetch to return a blob
			const mockBlob = new Blob(['test content'], { type: 'image/jpeg' });
			globalThis.fetch = vi.fn().mockResolvedValue({
				blob: vi.fn().mockResolvedValue(mockBlob)
			});

			// Spy on document methods
			const mockLink = {
				href: '',
				download: '',
				click: vi.fn(),
				remove: vi.fn()
			};

			const createElementSpy = vi
				.spyOn(document, 'createElement')
				.mockReturnValue(mockLink as unknown as HTMLElement);
			const appendChildSpy = vi
				.spyOn(document.body, 'appendChild')
				.mockImplementation(() => mockLink as unknown as Node);
			const removeChildSpy = vi
				.spyOn(document.body, 'removeChild')
				.mockImplementation(() => mockLink as unknown as Node);

			const file: ConvertedFile = {
				id: 'test-id',
				originalFile: new File([''], 'test.png', { type: 'image/png' }),
				originalUrl: 'original-url',
				convertedUrl: 'converted-url',
				filename: 'test.jpg',
				isConverting: false,
				sourceFormat: 'png',
				targetFormat: 'jpg',
				originalSize: 1000,
				convertedSize: 800
			};

			await converter.downloadFile(file);

			expect(globalThis.fetch).toHaveBeenCalledWith('converted-url');
			expect(createElementSpy).toHaveBeenCalledWith('a');
			expect(mockLink.download).toBe('test.jpg');
			expect(mockLink.href).toMatch(/^blob:/);
			expect(mockLink.click).toHaveBeenCalled();
			expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
			expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
		});

		it('should handle download errors gracefully', async () => {
			// Mock fetch to reject
			globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

			// Spy on console.error to check it's called
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			const file: ConvertedFile = {
				id: 'test-id',
				originalFile: new File([''], 'test.png', { type: 'image/png' }),
				originalUrl: 'original-url',
				convertedUrl: 'converted-url',
				filename: 'test.jpg',
				isConverting: false,
				sourceFormat: 'png',
				targetFormat: 'jpg',
				originalSize: 1000,
				convertedSize: 800
			};

			// Should not throw, but log error
			await converter.downloadFile(file);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'[ImageConverter] Download failed',
				expect.objectContaining({
					filename: 'test.jpg',
					error: 'Network error'
				})
			);

			consoleErrorSpy.mockRestore();
		});
	});
});
