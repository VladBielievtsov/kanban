import React, { useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Slider,
  useToast,
} from "@/components/ui";
import { Camera } from "lucide-react";
import AvatarEditor from "react-avatar-editor";
import { useThemeStore } from "@/store/theme";
import { useUserStore } from "@/store/user";
import { LoadingSpinner } from "@/components/icons/LoadingSpinner";

interface Props {
  avatar_url: string | undefined;
  first_name: string | undefined;
  userID: string | undefined;
}

export default function UserAvatar({ avatar_url, first_name, userID }: Props) {
  const { theme } = useThemeStore();
  const { updateAvatar, user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isGif, setIsGif] = useState<boolean>(false);
  const editorRef = useRef<AvatarEditor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const maxSize = 5 * 1024 * 1024;

  const { toast } = useToast();

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PNG, JPG, JPEG, and GIF files are allowed");
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size should not exceed 5MB");
      setFile(null);
      return;
    }

    if (selectedFile.type === "image/gif") {
      setIsGif(true);
      setError(null);
      setFile(selectedFile);
      return;
    }

    setIsGif(false);
    setError(null);
    setFile(selectedFile);
  };

  const resetStates = () => {
    setIsGif(false);
    setFile(null);
    setError(null);
  };

  const makeRequest = async (formData: FormData) => {
    await updateAvatar(userID, formData)
      .then(() => {
        setIsOpen(false);
        setTimeout(() => {
          resetStates();
        }, 200);
        toast({
          title: "Your avatar has been updated",
          variant: "success",
        });
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSave = async () => {
    setLoading(true);
    if (editorRef.current && file) {
      const fileType = file.type;

      editorRef.current.getImageScaledToCanvas().toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append("avatar", blob, `avatar.${fileType.split("/")[1]}`);

          await makeRequest(formData);
        }
      }, fileType);
    }
    if (isGif && file) {
      const formData = new FormData();
      formData.append("avatar", file);

      await makeRequest(formData);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-4">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetStates();
        }}
      >
        <DialogTrigger>
          <div className="relative rounded-full overflow-hidden">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={
                  avatar_url?.startsWith("http")
                    ? avatar_url
                    : process.env.NEXT_PUBLIC_BACKEND! + "/" + avatar_url
                }
                className="object-cover"
              />
              <AvatarFallback>{first_name && first_name[0]}</AvatarFallback>
            </Avatar>
            <label className="group transition w-16 h-16 absolute top-0 left-0 bg-black bg-opacity-0 hover:bg-opacity-40 cursor-pointer flex items-center justify-center">
              <Camera
                stroke={"white"}
                className="opacity-0 group-hover:opacity-100 transition"
              />
            </label>
          </div>
        </DialogTrigger>
        <DialogContent className="bground max-w-none w-auto">
          <DialogHeader>
            <DialogTitle>Crop avatar</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!file && (
              <>
                <label className="relative rounded-full transition w-[270px] h-[270px] bg-zinc-300 hover:bg-zinc-400 dark:bg-[#434343] dark:hover:bg-[#2e2e2e] cursor-pointer flex items-center justify-center">
                  <Camera className="w-[80px] h-[80px]" />
                  <input
                    type="file"
                    className="absolute w-0 h-0 opacity-0"
                    onChange={selectFile}
                  />
                </label>
                {error && (
                  <p className="text-red-500 font-bold text-sm mt-2">{error}</p>
                )}
              </>
            )}
            {file && !isGif && (
              <>
                <div className="rounded-lg overflow-hidden">
                  <AvatarEditor
                    ref={editorRef}
                    image={file || ""}
                    width={270}
                    height={270}
                    color={
                      theme === "dark"
                        ? [24, 24, 27, 0.8]
                        : [255, 255, 255, 0.8]
                    }
                    scale={scale}
                    rotate={0}
                    border={0}
                    borderRadius={270}
                  />
                </div>
                <div className="mt-6">
                  <Slider
                    defaultValue={[scale]}
                    max={5}
                    min={1}
                    step={0.1}
                    onValueChange={(e) => setScale(e[0])}
                  />
                </div>
                {error && (
                  <p className="text-red-500 font-bold text-sm mt-2">{error}</p>
                )}
              </>
            )}
            {file && isGif && (
              <>
                <Avatar className="w-[270px] h-[270px]">
                  <AvatarImage
                    src={URL.createObjectURL(file)}
                    className="object-cover"
                  />
                  <AvatarFallback>IMG</AvatarFallback>
                </Avatar>
                {error && (
                  <p className="text-red-500 font-bold text-sm mt-2">{error}</p>
                )}
              </>
            )}
          </div>
          {file && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} onClick={resetStates}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSave}>
                {loading ? <LoadingSpinner /> : "Save"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <div>
        <b>Profile Picture</b>
        <p className="opacity-50">PNG, JPG, GIF max size of 5MB</p>
      </div>
    </div>
  );
}
