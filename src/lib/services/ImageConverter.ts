export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export interface ConvertedFile {
	id: string;
	originalFile: File;
	originalUrl: string;
	convertedUrl: string;
	filename: string;
	isConverting: boolean;
	sourceFormat: string;
	targetFormat: ImageFormat;
	originalSize: number;
	convertedSize: number;
}

export interface FormatOption {
	value: ImageFormat;
	label: string;
	mimeType: string;
}

export class ImageConverter {
	private static readonly SUPPORTED_INPUT_FORMATS = [
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/webp',
		'image/gif',
		'image/svg+xml',
		'image/x-icon',
		'image/vnd.microsoft.icon',
		'image/tiff',
		'image/avif'
	];

	private static readonly SUPPORTED_EXTENSIONS = [
		'png',
		'jpg',
		'jpeg',
		'gif',
		'webp',
		'svg',
		'ico',
		'tiff',
		'avif'
	];

	private static readonly MIME_TO_EXT: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
		'image/gif': 'gif',
		'image/svg+xml': 'svg',
		'image/x-icon': 'ico',
		'image/vnd.microsoft.icon': 'ico',
		'image/tiff': 'tiff',
		'image/avif': 'avif'
	};

	// Public API methods

	async convertImage(
		file: File,
		targetFormat: ImageFormat
	): Promise<{ url: string; size: number }> {
		console.log(`[ImageConverter] Starting conversion for ${file.name}`, {
			sourceType: file.type,
			sourceSize: this.formatFileSize(file.size),
			targetFormat: targetFormat
		});

		try {
			// Load the image
			const img = await this.loadImage(file);

			// Setup canvas with image and format-specific handling
			const canvas = this.setupCanvas(img, targetFormat);

			// Get format configuration
			const { mimeType, quality } = this.getFormatConfig(targetFormat);

			// Convert canvas to blob
			const blob = await this.canvasToBlob(canvas, mimeType, quality);

			// Create result URL
			const url = URL.createObjectURL(blob);

			console.log(`[ImageConverter] Conversion successful`, {
				filename: file.name,
				outputMimeType: mimeType,
				quality: quality,
				newSize: this.formatFileSize(blob.size),
				sizeChange: `${(((blob.size - file.size) / file.size) * 100).toFixed(1)}%`
			});

			return { url, size: blob.size };
		} catch (error) {
			console.error(`[ImageConverter] Conversion failed`, {
				filename: file.name,
				error: error instanceof Error ? error.message : error
			});
			throw error;
		}
	}

	doesSupportFileType(file: File): boolean {
		// Check if MIME type is supported
		if (ImageConverter.SUPPORTED_INPUT_FORMATS.includes(file.type)) {
			return true;
		}

		// Fallback to check by file extension
		const ext = file.name.split('.').pop()?.toLowerCase();
		return ImageConverter.SUPPORTED_EXTENSIONS.includes(ext || '');
	}

	filterSupportedFiles(fileList: FileList): File[] {
		console.log(`[ImageConverter] Processing ${fileList.length} file(s)`);

		const imageFiles = Array.from(fileList).filter((file) => {
			const isSupported = this.doesSupportFileType(file);

			if (!isSupported) {
				const ext = file.name.split('.').pop()?.toLowerCase();
				console.warn(`[ImageConverter] Unsupported file type`, {
					filename: file.name,
					type: file.type,
					extension: ext
				});
			}

			return isSupported;
		});

		console.log(`[ImageConverter] ${imageFiles.length} supported image file(s) found`);
		return imageFiles;
	}

	createConvertedFileRecord(file: File, targetFormat: ImageFormat): ConvertedFile {
		const id = this.generateId();
		const originalUrl = URL.createObjectURL(file);
		const sourceFormat =
			this.getFileExtension(file.type) || file.name.split('.').pop()?.toLowerCase() || 'unknown';
		const baseFilename = file.name.replace(/\.[^.]+$/, '');
		const filename = `${baseFilename}.${targetFormat}`;

		console.log(`[ImageConverter] Creating file record`, {
			id: id,
			originalName: file.name,
			newFilename: filename,
			sourceFormat: sourceFormat,
			targetFormat: targetFormat,
			originalSize: this.formatFileSize(file.size)
		});

		return {
			id,
			originalFile: file,
			originalUrl,
			convertedUrl: '',
			filename,
			isConverting: true,
			sourceFormat,
			targetFormat: targetFormat,
			originalSize: file.size,
			convertedSize: 0
		};
	}

	async downloadFile(file: ConvertedFile): Promise<void> {
		console.log(`[ImageConverter] Starting download`, {
			id: file.id,
			filename: file.filename,
			size: this.formatFileSize(file.convertedSize)
		});

		try {
			const response = await fetch(file.convertedUrl);
			const blob = await response.blob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = file.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			console.log(`[ImageConverter] Download initiated successfully`, {
				filename: file.filename
			});
		} catch (error) {
			console.error(`[ImageConverter] Download failed`, {
				filename: file.filename,
				error: error instanceof Error ? error.message : error
			});
		}
	}

	cleanupFile(file: ConvertedFile): void {
		console.log(`[ImageConverter] Cleaning up file`, {
			id: file.id,
			filename: file.filename,
			originalName: file.originalFile.name
		});

		URL.revokeObjectURL(file.originalUrl);
		if (file.convertedUrl) {
			URL.revokeObjectURL(file.convertedUrl);
		}
	}

	cleanupFiles(files: ConvertedFile[]): void {
		console.log(`[ImageConverter] Cleaning up ${files.length} files`);
		files.forEach((file) => this.cleanupFile(file));
	}

	// Private helper methods
	private generateId(): string {
		return Math.random().toString(36).substring(2, 11);
	}

	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	private getFileExtension(mimeType: string): string {
		return ImageConverter.MIME_TO_EXT[mimeType] || 'unknown';
	}

	private getFormatConfig(targetFormat: ImageFormat): { mimeType: string; quality: number } {
		switch (targetFormat) {
			case 'png':
				return { mimeType: 'image/png', quality: 1 }; // PNG doesn't use quality parameter
			case 'webp':
				return { mimeType: 'image/webp', quality: 0.9 };
			case 'jpg':
			case 'jpeg':
			default:
				return { mimeType: 'image/jpeg', quality: 0.9 };
		}
	}

	private setupCanvas(img: HTMLImageElement, targetFormat: ImageFormat): HTMLCanvasElement {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = img.width;
		canvas.height = img.height;

		if (ctx) {
			// For JPEG, fill with white background to handle transparency
			if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			ctx.drawImage(img, 0, 0);
		}

		return canvas;
	}

	private async canvasToBlob(
		canvas: HTMLCanvasElement,
		mimeType: string,
		quality: number
	): Promise<Blob> {
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error('Failed to convert canvas to blob'));
					}
				},
				mimeType,
				quality
			);
		});
	}

	private async loadImage(file: File): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();

			img.onload = () => {
				console.log(`[ImageConverter] Image loaded successfully`, {
					filename: file.name,
					dimensions: `${img.width}x${img.height}`
				});
				resolve(img);
			};

			img.onerror = (event) => {
				const error = new Error(`Failed to load image: ${file.name}`);
				console.error(`[ImageConverter] Image load error`, {
					filename: file.name,
					fileType: file.type,
					fileSize: file.size,
					error: error.message,
					event: event
				});
				reject(error);
			};

			// Handle SVG files specially
			if (file.type === 'image/svg+xml') {
				console.log(`[ImageConverter] Handling SVG file: ${file.name}`);
				const reader = new FileReader();
				reader.onload = (e) => {
					const svgString = e.target?.result as string;
					const blob = new Blob([svgString], { type: 'image/svg+xml' });
					img.src = URL.createObjectURL(blob);
				};
				reader.onerror = (error) => {
					console.error(`[ImageConverter] Failed to read SVG file`, {
						filename: file.name,
						error: error
					});
					reject(new Error(`Failed to read SVG file: ${file.name}`));
				};
				reader.readAsText(file);
			} else {
				img.src = URL.createObjectURL(file);
			}
		});
	}
}
