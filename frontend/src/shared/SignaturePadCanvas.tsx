import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import SignaturePad from "signature_pad";

export interface SignaturePadRef {
  clear: () => void;
  toDataURL: (type?: string, encoderOptions?: number) => string;
  fromDataURL: (dataUrl: string) => void;
  isEmpty: () => boolean;
}

interface Props {
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
  onDraw?: () => void;
}

const SignaturePadCanvas = forwardRef<SignaturePadRef, Props>(
  (
    {
      width = 400,
      height = 150,
      penColor = "#000",
      backgroundColor = "#fff",
      className = "",
      onDraw,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);

    useEffect(() => {
      if (canvasRef.current) {
        const pad = new SignaturePad(canvasRef.current, {
          penColor,
          backgroundColor,
        });
        signaturePadRef.current = pad;
        // Set background color
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
        // Listen for end of stroke to trigger onDraw
        const handleDraw = () => {
          if (typeof onDraw === "function") {
            onDraw();
          }
        };
        pad.on();
        // signature_pad does not have a direct event, so we listen to mouseup/touchend
        const canvas = canvasRef.current;
        canvas.addEventListener("mouseup", handleDraw);
        canvas.addEventListener("touchend", handleDraw);
        return () => {
          pad.off();
          canvas.removeEventListener("mouseup", handleDraw);
          canvas.removeEventListener("touchend", handleDraw);
          signaturePadRef.current = null;
        };
      }
      return () => {
        signaturePadRef.current?.off();
        signaturePadRef.current = null;
      };
    }, [penColor, backgroundColor, width, height, onDraw]);

    useImperativeHandle(ref, () => ({
      clear: () => signaturePadRef.current?.clear(),
      toDataURL: (type?: string, encoderOptions?: number) =>
        signaturePadRef.current?.toDataURL(type, encoderOptions) ?? "",
      fromDataURL: (dataUrl: string) =>
        signaturePadRef.current?.fromDataURL(dataUrl),
      isEmpty: () => signaturePadRef.current?.isEmpty() ?? true,
    }));

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        style={{
          background: backgroundColor,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      />
    );
  },
);

export default SignaturePadCanvas;
