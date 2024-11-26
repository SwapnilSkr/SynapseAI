import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onClose,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropComplete = useCallback(() => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
    onClose();
  }, [croppedAreaPixels, onCropComplete, onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-64">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete}>Crop</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
