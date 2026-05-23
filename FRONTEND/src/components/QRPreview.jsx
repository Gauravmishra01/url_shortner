import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "./ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";

const QRPreview = ({ value, size = 240, className = "", label }) => {
  const [svg, setSvg] = useState(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const svgRef = useRef(null);
  const { pushToast } = useAppUI();

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
      pushToast({
        title: "QR image copied",
        message: "The QR code image is ready to paste or share.",
        tone: "success",
      });
    } catch (e) {
      console.error(e);
      pushToast({
        title: "Copy failed",
        message: "Your browser blocked image copying.",
        tone: "danger",
      });
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
        pushToast({
          title: "QR shared",
          message: "Native share opened successfully.",
          tone: "success",
        });
      } catch (e) {
        console.error(e);
        pushToast({
          title: "Share failed",
          message: "Native sharing is not available on this device.",
          tone: "danger",
        });
      }
    } else {
      pushToast({
        title: "Share unavailable",
        message: "This device does not support native sharing for images.",
        tone: "warning",
      });
    }
  };

  return (
    <div className={`qr-preview space-y-3 ${className}`.trim()}>
      {label && (
        <div className="text-sm font-semibold text-[color:var(--text)]">
          {label}
        </div>
      )}
      <div
        className="qr-canvas inline-block rounded-3xl bg-white p-3 shadow-lg shadow-black/5"
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svg ?? "" }}
      />
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={downloadPng}
          className="w-full sm:w-auto"
        >
          PNG
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={downloadSvg}
          className="w-full sm:w-auto"
        >
          SVG
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copyImage}
          className="w-full sm:w-auto"
        >
          Copy
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={share}
          className="w-full sm:w-auto"
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default QRPreview;
