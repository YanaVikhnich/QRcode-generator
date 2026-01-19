const qrcodeGenerateBtn = document.querySelector(".qr-generate-button");
const qrCodeContainer = document.querySelector(".QRcode-container");
const downloadBtn = document.querySelector(".download-button");
const shareBtn = document.querySelector(".share-button");
const URL = document.querySelector('.input-control');
const urlContainer = document.querySelector(".URL-container");
const QRcode = document.querySelector(".QR");

let qrcode
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


qrcodeGenerateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let qrContent = URL.value;
    if (qrContent != "") {
        generateQRCode(qrContent);
    }
    urlContainer.classList.toggle("hidden");
    qrCodeContainer.classList.toggle("hidden");

 })

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
        const filesArray = [new File([blob], "qrcode.png", { type: blob.type })];
        if (navigator.canShare && navigator.canShare(filesArray)) {
            await navigator.share({
                title: "QR Code",
                files: filesArray,
            });
        } else {
            window.open(imgSRC);
            console.error("Sharing not supported or not enabled");
        }
    } catch (error) {
        console.error("Error sharing QR code:", error);
    }
})