<script lang="ts">
	import UploadIcon from '$lib/icons/UploadIcon.svelte';
	import {
		ImageConverter,
		type ImageFormat,
		type ConvertedFile,
		type FormatOption
	} from '$lib/services/ImageConverter.js';

	const FORMAT_OPTIONS: FormatOption[] = [
		{ value: 'jpg', label: 'JPG/JPEG', mimeType: 'image/jpeg' },
		{ value: 'png', label: 'PNG', mimeType: 'image/png' },
		{ value: 'webp', label: 'WebP', mimeType: 'image/webp' }
	];

	const converter = new ImageConverter();

	let files: ConvertedFile[] = $state([]);
	let dragOver = $state(false);
	let fileInput: HTMLInputElement;
	let selectedFormat: ImageFormat = $state('jpg');

	async function handleFiles(fileList: FileList) {
		const imageFiles = converter.filterSupportedFiles(fileList);

		for (const file of imageFiles) {
			const convertedFile = converter.createConvertedFileRecord(file, selectedFormat);
			files = [...files, convertedFile];

			try {
				// Convert the file
				const result = await converter.convertImage(file, selectedFormat);

				// Update the file with converted URL and size
				files = files.map((f) =>
					f.id === convertedFile.id
						? { ...f, convertedUrl: result.url, convertedSize: result.size, isConverting: false }
						: f
				);
			} catch {
				// Remove the file if conversion failed
				files = files.filter((f) => f.id !== convertedFile.id);
			}
		}

		// Clear file input to allow re-selection of same files
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function handleFileSelect() {
		if (fileInput.files) {
			handleFiles(fileInput.files);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		if (event.dataTransfer?.files) {
			handleFiles(event.dataTransfer.files);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	async function downloadFile(file: ConvertedFile) {
		await converter.downloadFile(file);
	}

	function removeFile(id: string) {
		const fileToRemove = files.find((f) => f.id === id);
		if (fileToRemove) {
			converter.cleanupFile(fileToRemove);
		}
		files = files.filter((f) => f.id !== id);
	}

	function clearAll() {
		converter.cleanupFiles(files);
		files = [];
	}
</script>

<!-- Format Selection -->
<div class="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
	<div class="mb-3 block text-sm font-medium text-gray-700 sm:mb-4">Output Format</div>
	<div class="grid grid-cols-3 gap-2 sm:gap-3">
		{#each FORMAT_OPTIONS as format (format.value)}
			<button
				class="rounded-lg border-2 px-2 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-3 sm:text-sm {selectedFormat ===
				format.value
					? 'border-blue-500 bg-blue-50 text-blue-700'
					: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}"
				onclick={() => (selectedFormat = format.value)}
			>
				{format.label}
			</button>
		{/each}
	</div>
	<p class="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-sm">
		Choose the format you want to convert your images to
	</p>
</div>

<!-- Upload Area -->
<div class="mb-6 sm:mb-8">
	<div
		role="button"
		tabindex="0"
		class="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors duration-200 sm:p-8 {dragOver
			? 'border-blue-500 bg-blue-50'
			: 'hover:border-gray-400'}"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
	>
		<div class="mb-3 sm:mb-4">
			<UploadIcon />
		</div>
		<div class="mb-3 sm:mb-4">
			<p class="mb-2 text-base text-gray-700 sm:text-lg">Drop your images here</p>
			<p class="text-xs text-gray-500 sm:text-sm">or</p>
		</div>
		<input
			type="file"
			multiple
			accept="image/*"
			class="hidden"
			bind:this={fileInput}
			onchange={handleFileSelect}
		/>
		<button
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 sm:px-6 sm:py-3"
			onclick={() => fileInput.click()}
		>
			Choose Images
		</button>
		<p class="mt-3 text-xs text-gray-500 sm:mt-4">
			Supports PNG, JPG, WebP, GIF, SVG, AVIF, ICO, TIFF • Multiple files
		</p>
	</div>
</div>

<!-- Converted Files -->
{#if files.length > 0}
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-semibold text-gray-900">Your Images ({files.length})</h2>
			{#if files.length > 1}
				<button
					class="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-200"
					onclick={clearAll}
				>
					Clear All
				</button>
			{/if}
		</div>

		{#each files as file (file.id)}
			<div class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
				<div class="flex items-start gap-3 sm:items-center sm:gap-4">
					<!-- Image Preview -->
					<div class="flex-shrink-0">
						{#if file.isConverting}
							<div
								class="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 sm:h-16 sm:w-16"
							>
								<div
									class="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600 sm:h-6 sm:w-6"
								></div>
							</div>
						{:else}
							<img
								src={file.convertedUrl}
								alt="Converted file preview"
								class="h-12 w-12 rounded-lg border border-gray-200 object-cover sm:h-16 sm:w-16"
							/>
						{/if}
					</div>

					<!-- File Info -->
					<div class="min-w-0 flex-1">
						<div class="truncate text-sm font-medium text-gray-900 sm:text-base">
							{file.originalFile.name}
						</div>
						<div class="text-xs text-gray-500 sm:text-sm">
							{#if file.isConverting}
								Converting {file.sourceFormat.toUpperCase()} → {file.targetFormat.toUpperCase()}...
							{:else}
								<div class="space-y-1">
									<span class="inline-flex flex-wrap items-center gap-1">
										<span class="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium uppercase">
											{file.sourceFormat}
										</span>
										→
										<span
											class="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 uppercase"
										>
											{file.targetFormat}
										</span>
									</span>
									<div class="flex flex-wrap items-center gap-1 text-xs">
										<span class="font-medium">Size:</span>
										<span>{converter.formatFileSize(file.originalSize)}</span>
										<span>→</span>
										<span
											class={file.convertedSize < file.originalSize
												? 'font-medium text-green-600'
												: file.convertedSize > file.originalSize
													? 'font-medium text-orange-600'
													: 'font-medium'}
										>
											{converter.formatFileSize(file.convertedSize)}
										</span>
										{#if file.convertedSize !== file.originalSize}
											<span
												class={file.convertedSize < file.originalSize
													? 'text-green-600'
													: 'text-orange-600'}
											>
												({file.convertedSize < file.originalSize ? '-' : '+'}{Math.abs(
													Math.round(
														((file.convertedSize - file.originalSize) / file.originalSize) * 100
													)
												)}%)
											</span>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
						{#if !file.isConverting}
							<button
								class="rounded-lg bg-green-600 px-2 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700 sm:px-3 sm:py-2 sm:text-sm"
								onclick={() => downloadFile(file)}
							>
								Download
							</button>
						{/if}
						<button
							class="rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 sm:px-3 sm:py-2 sm:text-sm"
							onclick={() => removeFile(file.id)}
						>
							Remove
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
