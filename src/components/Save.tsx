import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { saveAs } from "file-saver";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { uploadDrawings } from "@/features/drawings/drawingsSlice";
import { UploadCloud } from "lucide-react";

export default function Save({ canvas }: { canvas: HTMLCanvasElement | null }) {
  const drawings = useAppSelector((state) => state.drawings);
  const dispatch = useAppDispatch();

  const downloadImage = () => {
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "canvas.png");
        }
      });
    }
  };

  const downloadJSON = () => {
    const jsonString = JSON.stringify(drawings);
    const blob = new Blob([jsonString], { type: "application/json" });

    saveAs(blob, "drawings_data.json");
  };

  const uploadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const jsonData = reader.result as string;
      try {
        const data = JSON.parse(jsonData);
        if (
          data &&
          Array.isArray(data.lines) &&
          typeof data.currentStep === "number"
        ) {
          dispatch(uploadDrawings(data));
        } else {
          alert(
            "Invalid JSON data format. This might be caused by a wrong data type."
          );
          console.error("Invalid JSON data format.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      } finally {
        //Let the user upload the same drawing as before
        event.target.value = "";
      }
    };

    reader.onerror = (error) => {
      console.error("Error occurred while reading the file:", error);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 items-center">
      <label
        htmlFor="file-upload"
        className="hover:bg-gray-100 py-2 px-4 rounded-md cursor-pointer flex items-center"
        title="Upload drawing (JSON)"
      >
        <UploadCloud className="h-6 w-6" strokeWidth={1.75} />
        <input
          className="hidden"
          type="file"
          accept=".json"
          onChange={uploadJSON}
          id="file-upload"
        />
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Save</Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="end">
          <a
            href="#"
            onClick={downloadImage}
            className="block hover:bg-gray-100 py-2 px-4 rounded-md"
          >
            Image (png)
          </a>
          <a
            href="#"
            onClick={downloadJSON}
            className="block hover:bg-gray-100 py-2 px-4 rounded-md"
          >
            JSON
          </a>
        </PopoverContent>
      </Popover>
    </div>
  );
}
