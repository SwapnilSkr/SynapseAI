import { useState, useCallback } from "react";
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

export default function AccountSettings() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [avatarUrl, setAvatarUrl] = useState(
    "/placeholder.svg?height=100&width=100"
  );
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically send the updated data to your backend
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

  const handleCropComplete = useCallback(
    (croppedAreaPixels: Area) => {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = imageToEdit as string;
      image.onload = () => {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        const croppedImageUrl = canvas.toDataURL("image/jpeg");
        setAvatarUrl(croppedImageUrl);
      };
    },
    [imageToEdit]
  );

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
