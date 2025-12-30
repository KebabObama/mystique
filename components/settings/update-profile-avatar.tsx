"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { authClient, getCroppedImg } from "@/lib/utils";
import { uploadFile } from "@/server/upload-file";
import { Camera, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "../layout/toast";
import { Border } from "../ui/border";
import { Dialog } from "../ui/dialog";
import { Slider } from "../ui/slider";

export const UpdateUserAvatar = () => {
  const user = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !pixels) return;
    setLoading(true);
    try {
      const blob = await getCroppedImg(imageSrc, pixels);
      const formData = new FormData();
      formData.append("file", blob, "avatar.png");
      const res = await uploadFile("avatars-bucket", formData, user.id);
      if (res.success) {
        await authClient.updateUser({ image: res.url });
        useUser.setState((prev) => ({ ...prev, image: `${res.url}?t=${Date.now()}` }));
        toast.success("Avatar updated!");
        setOpen(false);
        setImageSrc(null);
        if (inputRef.current) inputRef.current.value = ""; // Reset input
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-card ascepct-1/10 relative flex w-full flex-col justify-between gap-6 rounded-xl border p-6 md:flex-row">
        <Border />

        <Avatar
          className="group relative aspect-square size-full border-2 transition-all duration-200 hover:scale-95 md:size-1/3"
          onClick={() => inputRef.current?.click()}
        >
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback className="text-xl">{user?.name?.charAt(0)}</AvatarFallback>
          <Camera className="fill-background/30 text-border group-hover:text-foreground absolute top-1/2 left-1/2 size-12 -translate-1/2 drop-shadow-md transition-all duration-200 group-hover:size-24" />
        </Avatar>

        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={onFileChange}
          accept="image/*"
        />

        <div className="flex-start f-full flex h-full flex-col gap-3 md:w-2/3">
          <Button className="w-full" onClick={() => inputRef.current?.click()}>
            Choose Image
          </Button>
          <div>
            <h3 className="text-center text-lg font-medium">Profile Picture</h3>
            <p className="text-muted">
              PNG, JPG or WebP. Max 4MB. If your profile picture is over this size limit, and you do
              not want to change it's quality, consider cropping it before uploading. Sincerely The
              guy who made this API (aka. Me).
            </p>
          </div>
        </div>
      </section>
      <Dialog.Root
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setImageSrc(null);
        }}
      >
        <Dialog.Content className="sm:max-w-112.5">
          <Dialog.Title>Crop Image</Dialog.Title>
          <Dialog.Description>Drag to reposition and scroll to zoom.</Dialog.Description>

          <div
            onDrag={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="relative z-200 mt-6 aspect-square w-full overflow-hidden rounded-lg bg-zinc-950"
          >
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, p) => setPixels(p)}
              />
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Zoom</span>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(e) => setZoom(e[0])}
                className="bg-secondary h-1 w-full cursor-pointer appearance-none rounded-lg"
              />
            </div>

            <Dialog.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={loading} className="min-w-28">
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
              </Button>
            </Dialog.Footer>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
