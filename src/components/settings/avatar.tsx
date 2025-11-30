"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { uploadToBucket } from "@/lib/bucket/upload";
import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "../layout/toast";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { Slider } from "../ui/slider";

const getCroppedImg = async (
  imageSrc: string,
  crop: { width: number; height: number; x: number; y: number }
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
};

export const Avatar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    reset();
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    try {
      const path = `${crypto.randomUUID()}.png`;
      console.log(1);
      const f = await getCroppedImg(imageSrc, croppedAreaPixels);
      const result = await uploadToBucket("avatars-bucket", f, path);
      console.log(2);
      if (!result.success) throw new Error();
      const { error } = await authClient.updateUser({
        image: result.path,
      });
      console.log(3);
      if (error) throw new Error();
      toast.success("Profile picture updated successfully!");
      setImageSrc(null);
      reset();
    } catch (error) {
      toast.error("An error occurred while uploading. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <ResponsiveDialog
      asChild
      trigger={<Button>Upload Profile Picture</Button>}
      title={"Upload and Crop Avatar"}
      children={
        <>
          <button
            type="button"
            className="group bg-muted relative mt-4 aspect-square w-full overflow-hidden rounded-lg border-3 border-dashed transition-colors duration-200 select-none hover:border-black/20"
            onClick={() => {
              if (imageSrc === null) inputRef.current?.click();
            }}
            aria-label="Select image to upload"
          >
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                <div className="text-foreground/60 relative flex items-center gap-4 font-semibold transition-all duration-300 group-hover:scale-110 group-hover:font-bold after:absolute after:top-5 after:left-0 after:h-0.5 after:w-0 after:rounded-xl after:bg-black/20 after:transition-[width] after:duration-500 group-hover:after:w-full">
                  No image selected
                </div>
              </div>
            )}
          </button>

          <div className="flex w-full flex-row items-center justify-between gap-2">
            <label htmlFor="zoom-slider" className="select-none">
              Zoom:
            </label>
            <Slider
              id="zoom-slider"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
              className="my-2 border"
            />
          </div>

          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              Select Image
            </Button>
            <Button onClick={onUpload} disabled={!imageSrc || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </>
      }
    />
  );
};
