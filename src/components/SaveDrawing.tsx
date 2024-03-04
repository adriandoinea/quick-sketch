import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { saveAs } from "file-saver";
import { useAppSelector } from "@/app/hooks";

export default function SaveDrawing({
  canvas,
}: {
  canvas: HTMLCanvasElement | null;
}) {
  const drawings = useAppSelector((state) => state.drawings);

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

  return (
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
  );
}
