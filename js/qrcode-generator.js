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

        const blocbURL = URL.createObjectURL(blob);
         let a = document.createElement("a");
        a.href = blocbURL;
  a.download = "qrcode.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

        URL.revokeObjectURL(blocbURL);
    }
    catch (error) {
        console.error("Error downloading QR code:", error);
    }
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
