import { useAppDispatch } from "@/app/hooks";
import { uploadDrawings } from "@/features/drawings/drawingsSlice";
import { UploadCloud } from "lucide-react";

export default function ImportDrawing() {
  const dispatch = useAppDispatch();

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
          alert("Invalid JSON data format.");
          console.error("Invalid JSON data format.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      } finally {
        //Allow the user upload the same drawing as before
        event.target.value = "";
      }
    };

    reader.onerror = (error) => {
      alert("An error occurred while reading the file.");
      console.error("Error occurred while reading the file:", error);
    };
    reader.readAsText(file);
  };

  return (
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
  );
}
