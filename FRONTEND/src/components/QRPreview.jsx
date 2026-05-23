import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const QRPreview = ({ value, size = 240, className = "", label }) => {
  const [svg, setSvg] = useState(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!value) return;
    // generate svg string
    QRCode.toString(value, { type: "svg", width: size }, (err, string) => {
      if (!err) setSvg(string);
    });
    // generate png data url
    QRCode.toDataURL(value, { width: size }).then((url) => setPngDataUrl(url));
  }, [value, size]);

  const download = (dataUrl, filename = "qrcode.png") => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    download(url, "qrcode.svg");
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!pngDataUrl) return;
    download(pngDataUrl, "qrcode.png");
  };

  const copyImage = async () => {
    try {
      if (!pngDataUrl) return;
      const res = await fetch(pngDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      alert("QR image copied to clipboard");
    } catch (e) {
      console.error(e);
      alert("Copy failed");
    }
  };

  const share = async () => {
    if (navigator.share && pngDataUrl) {
      try {
        const res = await fetch(pngDataUrl);
        const blob = await res.blob();
        const filesArray = [
          new File([blob], "qrcode.png", { type: blob.type }),
        ];
        await navigator.share({ files: filesArray, title: label ?? "QR Code" });
      } catch (e) {
        console.error(e);
        alert("Share failed");
      }
    } else {
      alert("Native share not supported on this device");
    }
  };

  return (
    <div className={`qr-preview ${className}`.trim()}>
      {label && <div className="text-sm font-semibold mb-2">{label}</div>}
      <div
        className="qr-canvas bg-white p-2 rounded-md inline-block"
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svg ?? "" }}
      />
      <div className="mt-2 flex gap-2">
        <button
          className="premium-button-subtle px-3 py-1 text-sm"
          onClick={downloadPng}
        >
          Download PNG
        </button>
        <button
          className="premium-button-subtle px-3 py-1 text-sm"
          onClick={downloadSvg}
        >
          Download SVG
        </button>
        <button
          className="premium-button-subtle px-3 py-1 text-sm"
          onClick={copyImage}
        >
          Copy Image
        </button>
        <button
          className="premium-button-subtle px-3 py-1 text-sm"
          onClick={share}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default QRPreview;
