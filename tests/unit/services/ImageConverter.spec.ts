import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImageConverter } from '$lib/services/ImageConverter';
import type { ConvertedFile, ImageFormat } from '$lib/services/ImageConverter';

describe('ImageConverter', () => {
	let converter: ImageConverter;
	let mockCreateObjectURL: ReturnType<typeof vi.fn>;
	let mockRevokeObjectURL: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		converter = new ImageConverter();

		// Mock URL methods
		mockCreateObjectURL = vi.fn(() => 'mock-url');
		mockRevokeObjectURL = vi.fn();

		global.URL.createObjectURL = mockCreateObjectURL;
		global.URL.revokeObjectURL = mockRevokeObjectURL;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('doesSupportFileType', () => {
		it('should return true for supported MIME types', () => {
			const supportedTypes = [
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/webp',
				'image/gif',
				'image/svg+xml'
			];

			supportedTypes.forEach((type) => {
				const file = new File([''], 'test.png', { type });
				expect(converter.doesSupportFileType(file)).toBe(true);
			});
		});

		it('should return false for unsupported MIME types', () => {
			const unsupportedTypes = ['text/plain', 'application/pdf', 'video/mp4', 'audio/mp3'];

			unsupportedTypes.forEach((type) => {
				const file = new File([''], 'test.txt', { type });
				expect(converter.doesSupportFileType(file)).toBe(false);
			});
		});

		it('should fallback to extension check when MIME type is empty', () => {
			const supportedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

			supportedExtensions.forEach((ext) => {
				const file = new File([''], `test.${ext}`, { type: '' });
				expect(converter.doesSupportFileType(file)).toBe(true);
			});
		});

		it('should return false for files with unsupported extensions and no MIME type', () => {
			const unsupportedExtensions = ['txt', 'pdf', 'doc', 'exe'];

			unsupportedExtensions.forEach((ext) => {
				const file = new File([''], `test.${ext}`, { type: '' });
				expect(converter.doesSupportFileType(file)).toBe(false);
			});
		});
	});

	describe('filterSupportedFiles', () => {
		it('should filter out unsupported files from FileList', () => {
			const files = [
				new File([''], 'image1.png', { type: 'image/png' }),
				new File([''], 'image2.jpg', { type: 'image/jpeg' }),
				new File([''], 'document.pdf', { type: 'application/pdf' }),
				new File([''], 'text.txt', { type: 'text/plain' }),
				new File([''], 'image3.webp', { type: 'image/webp' })
			];

			// Create a mock FileList
			const fileList = {
				length: files.length,
				item: (index: number) => files[index],
				[Symbol.iterator]: function* () {
					for (let i = 0; i < files.length; i++) {
						yield files[i];
					}
				}
			} as unknown as FileList;

			// Add array-like indexing
			for (let i = 0; i < files.length; i++) {
				(fileList as unknown as Record<number, File>)[i] = files[i];
			}

			const result = converter.filterSupportedFiles(fileList);

			expect(result).toHaveLength(3);
			expect(result[0].name).toBe('image1.png');
			expect(result[1].name).toBe('image2.jpg');
			expect(result[2].name).toBe('image3.webp');
		});

		it('should return empty array when no supported files', () => {
			const files = [
				new File([''], 'document.pdf', { type: 'application/pdf' }),
				new File([''], 'text.txt', { type: 'text/plain' })
			];

			const fileList = {
				length: files.length,
				item: (index: number) => files[index],
				[Symbol.iterator]: function* () {
					for (let i = 0; i < files.length; i++) {
						yield files[i];
					}
				}
			} as unknown as FileList;

			for (let i = 0; i < files.length; i++) {
				(fileList as unknown as Record<number, File>)[i] = files[i];
			}

			const result = converter.filterSupportedFiles(fileList);
			expect(result).toHaveLength(0);
		});
	});

	describe('createConvertedFileRecord', () => {
		it('should create a ConvertedFile record with correct properties', () => {
			const file = new File(['test content'], 'test-image.png', { type: 'image/png' });
			const targetFormat: ImageFormat = 'jpg';

			const record = converter.createConvertedFileRecord(file, targetFormat);

			expect(record).toMatchObject({
				originalFile: file,
				originalUrl: 'mock-url',
				convertedUrl: '',
				filename: 'test-image.jpg',
				isConverting: true,
				sourceFormat: 'png',
				targetFormat: 'jpg',
				originalSize: file.size,
				convertedSize: 0
			});

			expect(record.id).toBeDefined();
			expect(record.id).toHaveLength(9);
		});

		it('should handle files without extensions', () => {
			const file = new File(['test content'], 'test-image', { type: 'image/png' });
			const targetFormat: ImageFormat = 'webp';

			const record = converter.createConvertedFileRecord(file, targetFormat);

			expect(record.filename).toBe('test-image.webp');
			expect(record.sourceFormat).toBe('png');
		});

		it('should handle unknown MIME types', () => {
			const file = new File(['test content'], 'test.xyz', { type: '' });
			const targetFormat: ImageFormat = 'jpg';

			const record = converter.createConvertedFileRecord(file, targetFormat);

			expect(record.filename).toBe('test.jpg');
			// When MIME type is empty, getFileExtension returns 'unknown'
			// Even though it tries to fall back to file extension, since getFileExtension
			// already returned 'unknown', that's what sourceFormat will be
			expect(record.sourceFormat).toBe('unknown');
		});
	});

	describe('cleanupFile', () => {
		it('should revoke both original and converted URLs', () => {
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

			converter.cleanupFile(file);

			expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('original-url');
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('converted-url');
		});

		it('should handle files without converted URL', () => {
			const file: ConvertedFile = {
				id: 'test-id',
				originalFile: new File([''], 'test.png', { type: 'image/png' }),
				originalUrl: 'original-url',
				convertedUrl: '',
				filename: 'test.jpg',
				isConverting: true,
				sourceFormat: 'png',
				targetFormat: 'jpg',
				originalSize: 1000,
				convertedSize: 0
			};

			converter.cleanupFile(file);

			expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('original-url');
		});
	});

	describe('cleanupFiles', () => {
		it('should cleanup multiple files', () => {
			const files: ConvertedFile[] = [
				{
					id: 'test-id-1',
					originalFile: new File([''], 'test1.png', { type: 'image/png' }),
					originalUrl: 'original-url-1',
					convertedUrl: 'converted-url-1',
					filename: 'test1.jpg',
					isConverting: false,
					sourceFormat: 'png',
					targetFormat: 'jpg',
					originalSize: 1000,
					convertedSize: 800
				},
				{
					id: 'test-id-2',
					originalFile: new File([''], 'test2.png', { type: 'image/png' }),
					originalUrl: 'original-url-2',
					convertedUrl: 'converted-url-2',
					filename: 'test2.jpg',
					isConverting: false,
					sourceFormat: 'png',
					targetFormat: 'jpg',
					originalSize: 2000,
					convertedSize: 1600
				}
			];

			converter.cleanupFiles(files);

			expect(mockRevokeObjectURL).toHaveBeenCalledTimes(4);
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('original-url-1');
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('converted-url-1');
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('original-url-2');
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('converted-url-2');
		});

		it('should handle empty array', () => {
			converter.cleanupFiles([]);
			expect(mockRevokeObjectURL).not.toHaveBeenCalled();
		});
	});

	describe('downloadFile', () => {
		it('should handle download errors gracefully', async () => {
			global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
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
