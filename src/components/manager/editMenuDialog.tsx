'use client';

import { useGetCategories } from "@/api/manager/useCategory";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BaseMenuResponse,
  EditMenuRequest,
  MenuStatus,
} from "@/interfaces/menu";
import LoadingAnimation from "./loadingAnimation";
import { DefaultDropdown } from "./defaultDropdown";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMenu } from "@/api/manager/useMenu";

interface EditMenuDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  menu: BaseMenuResponse;
  refetchMenus: () => void;
}

// Update the form schema to use File or null for the image
const EditMenuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  category: z.string().nullable(),
  status: z.nativeEnum(MenuStatus),
  image: z.instanceof(File).nullable().optional(),
});

type EditMenuFormValues = z.infer<typeof EditMenuSchema>;

export function EditMenuDialog({
  openDialog,
  setOpenDialog,
  menu,
  refetchMenus,
}: EditMenuDialogProps) {
  const { data: categories = [], isLoading: loadingCategories } =
    useGetCategories();
  const editMenu = useEditMenu();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditMenuFormValues>({
    resolver: zodResolver(EditMenuSchema),
    defaultValues: {
      name: menu.name,
      category: categories.find((c) => c.id === menu.categoryId)?.name || null,
      status: menu.isAvailable ? MenuStatus.Available : MenuStatus.Unavailable,
      image: null,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(menu.imageUrl);

  useEffect(() => {
    setValue("name", menu.name);
    setPreviewImage(menu.imageUrl);
    setValue(
      "status",
      menu.isAvailable ? MenuStatus.Available : MenuStatus.Unavailable
    );
    setValue(
      "category",
      categories.find((c) => c.id === menu.categoryId)?.name || null
    );
  }, [menu, openDialog, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("image", file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: EditMenuFormValues) => {
    const categoryData = categories.find((c) => c.name === data.category);



    const editData: EditMenuRequest = {
      id: menu.id,
      name: data.name,
      categoryId: categoryData?.id,
      isAvailable: data.status === MenuStatus.Available,
      image: data.image ?? undefined,
    };

    await editMenu.mutateAsync(editData);
    refetchMenus();
    setOpenDialog(false);
  };

  if (loadingCategories) {
    return <LoadingAnimation />;
  }

  return (
    <Dialog open={openDialog}>
      <DialogContent className="sm:max-w-2xl w-full flex flex-col gap-6">
        <div className="flex flex-row h-full w-full gap-6">
          <div className="border-primary border rounded-lg w-5/12 max-h-[16rem] overflow-hidden">
            <Image
              src={previewImage || "/assets/images/no-img.svg"}
              alt="menu-image"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col w-7/12 gap-3">
            <div className="flex flex-col gap-2">
              <div>Menu Name:</div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <div>Type:</div>
              <DefaultDropdown
                list={categories.map((c) => c.name)}
                setSelected={(category) => setValue("category", category)}
                selected={watch("category")}
              />
              {errors.category && <p className="text-red-500">{errors.category.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <div>Image:</div>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>Status:</div>
              <DefaultDropdown
                list={[MenuStatus.Available, MenuStatus.Unavailable]}
                setSelected={(status) =>
                  setValue("status", status as MenuStatus)
                }
                selected={watch("status")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <div
            className="btn btn-error text-whereWhite"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </div>
          <div
            className="btn btn-primary text-whereWhite"
            onClick={handleSubmit(onSubmit)}
          >
            Save Change
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
