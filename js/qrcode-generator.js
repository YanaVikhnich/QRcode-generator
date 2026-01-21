const qrcodeGenerateBtn = document.querySelector(".qr-generate-button");
const qrCodeContainer = document.querySelector(".QRcode-container");
const downloadBtn = document.querySelector(".download-button");
const shareBtn = document.querySelector(".share-button");
const URLfield = document.querySelector(".input-control");
const urlContainer = document.querySelector(".URL-container");
const QRcode = document.querySelector(".QR");
const inputBtnContainer = document.querySelector(".input-button-container");

let qrcode;
function generateQRCode(text) {
  qrcode = new QRCode(QRcode, {
    text: text,
    width: 164,
    height: 164,
    colorDark: "#030616",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
URLfield.addEventListener("input", () => {
  clearError();
});

qrcodeGenerateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let qrContent = URLfield.value;
  if (qrContent != "") {
    generateQRCode(qrContent);

    urlContainer.classList.toggle("hidden");
    qrCodeContainer.classList.toggle("hidden");
  } else {
    showError();
  }
});

downloadBtn.addEventListener("click", async () => {
  let img = QRcode.querySelector("img");
  let imgSrc = img.src;

  try {
    const response = await fetch(imgSrc);
    const blob = await response.blob();

    const blobURL = URL.createObjectURL(blob);
    // const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    // if (isMobile) {
    //   window.open(blobURL, "_blank");
    //   return;
    // } else {
      let a = document.createElement("a");
      a.href = blobURL;
      a.download = "qrcode.png";
      a.addEventListener(
        "click",
        () => {
          setTimeout(() => {
            URL.revokeObjectURL(blobURL);
            a.remove();
          });
        },
        5000,
      );
      document.body.append(a);
      a.click();
      alert("QR code downloaded successfully");
    // }
  } catch (error) {
    console.error("Error downloading QR code:", error);
  }
});

shareBtn.addEventListener("click", async () => {
  let img = QRcode.querySelector("img");
  let imgSRC = img.src;
  try {
    const response = await fetch(imgSRC);
    const blob = await response.blob();
    const filesArray = [new File([blob], "qrcode.png", { type: blob.type })];
    if (navigator.canShare && navigator.canShare(filesArray)) {
      await navigator.share({
        title: "QR Code",
        text: "Here is your QR code",
        files: filesArray,
      });
    } else {
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      alert("QR code copied to clipboard");
    }
  } catch (error) {
    console.error("Error sharing QR code:", error);
    alert("Sharing failed. Please try again.");
  }
});

function clearError() {
  errorMes = inputBtnContainer.nextElementSibling;
  errorMes.classList.remove("error-message");
  errorMes.textContent = "";
  errorMes.remove();
}
function showError() {
  errorSpan = document.createElement("span");
  inputBtnContainer.after(errorSpan);
  errorSpan = inputBtnContainer.nextElementSibling;
  errorSpan.classList.add("error-message");
  errorSpan.textContent = `You need to enter the url`;
}
