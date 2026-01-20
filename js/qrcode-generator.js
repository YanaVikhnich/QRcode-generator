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

downloadBtn.addEventListener("click", () => {
  let img = QRcode.querySelector("img");
  let imgSrc = img.src;
  let a = document.createElement("a");
  a.href = imgSrc;
  a.download = "qrcode.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

shareBtn.addEventListener("click", async () => {
  let img = QRcode.querySelector("img");
  let imgSRC = img.src;
  try {
    const response = await fetch(imgSRC);
    const blob = await response.blob();
    const filesArray = [new File([blob], "qrcode.jpg", { type: blob.type })];
    if (navigator.canShare && navigator.canShare(filesArray)) {
      await navigator.share({
        title: "QR Code",
          text: "Here is your QR code",
        url: URLfield.value,
      });
    } else {
        const blocbURL = URL.createObjectURL(blob);
        window.open(blocbURL, "_blank");

        setTimeout(() => URL.revokeObjectURL(blocbURL), 5000);
    }
  } catch (error) {
    console.error("Error sharing QR code:", error);
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
