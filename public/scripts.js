document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const dropArea = document.getElementById("drop-area");
  const thumbnailContainer = document.getElementById("thumbnail-container");
  const uploadButton = document.getElementById("upload-button");
  const downloadAllButton = document.getElementById("download-all-button");
  let jpgUrls = [];

  // Visual changes.

  dropArea.addEventListener("dragover", function (e) {
    preventDefaultAndPropagation(e, true);
  });

  dropArea.addEventListener("dragleave", function (e) {
    preventDefaultAndPropagation(e, false);
  });

  dropArea.addEventListener("drop", function (e) {
    preventDefaultAndPropagation(e, false);
  });

  function preventDefaultAndPropagation(e, showBorder) {
    e.preventDefault();
    e.stopPropagation();
    if (showBorder) {
      dropArea.classList.add("border-green-500");
    } else {
      dropArea.classList.remove("border-green-500");
    }
  };

  // Functionality.

  dropArea.addEventListener("drop", function (e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  dropArea.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    const files = fileInput.files;
    handleFiles(files);
  });

  uploadButton.addEventListener("click", function () {
    fileInput.click();
  });

  async function handleFiles(files) {
    const fileArray = Array.from(files);
    for (let file of fileArray) {
      if (!file.type.startsWith("image/")) continue;

      const imgDiv = createThumbnailElement(file.name);
      thumbnailContainer.appendChild(imgDiv);

      try {
        const jpgBlob = await processImage(file);
        const jpgUrl = URL.createObjectURL(jpgBlob);
        jpgUrls.push({ url: jpgUrl, blob: jpgBlob });
        updateThumbnail(imgDiv, jpgUrl);
      } catch (error) {
        console.error("Error processing image:", error);
        updateThumbnailError(imgDiv);
      }
    }
  }

  function createThumbnailElement(fileName) {
    const imgDiv = document.createElement("div");
    imgDiv.className = "relative m-2 w-40 h-40 border border-gray-300 rounded overflow-hidden";
    imgDiv.innerHTML = `
      <div class="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div class="mt-2 text-sm text-gray-600">${fileName}</div>
      </div>
    `;
    return imgDiv;
  }

  function processImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(resolve, 'image/jpeg', 0.7);
        }
        img.onerror = reject;
        img.src = event.target.result;
      }
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function updateThumbnail(imgDiv, url) {
    imgDiv.innerHTML = `
      <img src="${url}" alt="Image" class="object-cover w-full h-full">
      <a href="${url}" download="image.jpg" class="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-sm rounded">Download</a>
      <button class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded" onclick="removeImage(this)">X</button>
    `;
  }

  function updateThumbnailError(imgDiv) {
    imgDiv.innerHTML = `
      <div class="absolute inset-0 bg-red-100 flex items-center justify-center">
        <div class="text-red-500">Error</div>
      </div>
    `;
  }

  window.removeImage = function (button) {
    const imgDiv = button.parentElement;
    thumbnailContainer.removeChild(imgDiv);
    const url = imgDiv.querySelector("img").src;
    jpgUrls = jpgUrls.filter(item => item.url !== url);
  };

  downloadAllButton.addEventListener("click", async function () {
    const zip = new JSZip();
    
    for (let i = 0; i < jpgUrls.length; i++) {
      try {
        zip.file(`image${i + 1}.jpg`, jpgUrls[i].blob, {binary: true});
      } catch (error) {
        console.error("Error adding image to zip:", error);
      }
    }

    zip.generateAsync({type: "blob"}).then(function (content) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
});