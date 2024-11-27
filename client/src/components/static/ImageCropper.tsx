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
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedAreaPixels: Area, rotation: number) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onClose,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation: number) => {
    setRotation(rotation);
  }, []);

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropComplete = useCallback(() => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels, rotation);
    }
    onClose();
  }, [croppedAreaPixels, rotation, onCropComplete, onClose]);

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
            cropShape="round"
            showGrid={false}
            rotation={rotation}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ZoomOut className="w-4 h-4" />
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-1"
              aria-label="Zoom"
            />
            <ZoomIn className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <RotateCw className="w-4 h-4" />
            <Slider
              min={0}
              max={360}
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              className="flex-1"
              aria-label="Rotation"
            />
            <span className="text-sm">{rotation}°</span>
          </div>
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
