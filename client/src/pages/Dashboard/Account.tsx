import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import ImageCropper from "@/components/static/ImageCropper";
import { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AccountSettings() {
  const [firstName, setFirstName] = useState<string>("John");
  const [lastName, setLastName] = useState<string>("Doe");
  const [email, setEmail] = useState<string>("john.doe@example.com");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/placeholder.svg?height=100&width=100"
  );
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email });
    toast({
      title: "Settings updated",
      description: "Your account settings have been updated successfully.",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToEdit(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return "";
    }

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) resolve(URL.createObjectURL(file));
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async (
    croppedAreaPixels: Area,
    rotation: number
  ) => {
    try {
      if (imageToEdit) {
        const croppedImage = await getCroppedImg(
          imageToEdit,
          croppedAreaPixels,
          rotation
        );
        setAvatarUrl(croppedImage);
        setCropperOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement password reset logic here
    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password.",
    });
    setResetPasswordOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarUrl} alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Change profile picture
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Dialog
              open={resetPasswordOpen}
              onOpenChange={setResetPasswordOpen}
            >
              <DialogTrigger asChild>
                <Button variant="link" className="px-0">
                  Reset Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email to receive password reset instructions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleResetPassword}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reset-email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Send Reset Email</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save changes</Button>
          </CardFooter>
        </form>
      </Card>
      {cropperOpen && imageToEdit && (
        <ImageCropper
          image={imageToEdit}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperOpen(false)}
        />
      )}
    </div>
  );
}
