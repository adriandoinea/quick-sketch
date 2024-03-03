import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  TrashIcon,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  changeBrushColor,
  changeBrushSize,
  switchTool,
} from "@/features/toolbar/toolbarSlice";

interface ToolsProps {
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
  isEraserDisabled: boolean;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export default function Tools({
  isUndoDisabled,
  isRedoDisabled,
  isEraserDisabled,
  onClear,
  onUndo,
  onRedo,
}: ToolsProps) {
  const tool = useAppSelector((state) => state.toolbar.tool);
  const brushSize = useAppSelector((state) => state.toolbar.brushSize);
  const brushColor = useAppSelector((state) => state.toolbar.brushColor);

  const dispatch = useAppDispatch();

  const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(switchTool(e.target.value as "pencil" | "eraser"));
  };

  const handleBrushSizeChange = (value: number[]) => {
    dispatch(changeBrushSize(value[0]));
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBrushColor(e.target.value));
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Button
          className="rounded-full border w-10 h-10"
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={isUndoDisabled}
          title="Undo"
        >
          <ArrowLeftCircleIcon className="w-4 h-4" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          className="rounded-full border w-10 h-10"
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={isRedoDisabled}
          title="Redo"
        >
          <ArrowRightCircleIcon className="w-4 h-4" />
          <span className="sr-only">Redo</span>
        </Button>
        <Button
          className="rounded-full border w-10 h-10"
          variant="outline"
          size="icon"
          onClick={onClear}
          title="Clear"
        >
          <TrashIcon className="w-4 h-4" />
          <span className="sr-only">Clear</span>
        </Button>
      </div>

      <Separator />

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex items-center gap-4">
          <Label
            className="flex items-center gap-2 cursor-pointer"
            htmlFor="tool"
          >
            <Input
              className="w-4 h-4 accent-black"
              id="tool"
              name="tool"
              type="radio"
              value="pencil"
              checked={tool === "pencil"}
              onChange={handleToolChange}
            />
            <span>Pencil</span>
          </Label>
          <Label
            className="flex items-center gap-2 cursor-pointer"
            htmlFor="tool2"
          >
            <Input
              className="w-4 h-4 accent-black"
              id="tool2"
              name="tool"
              type="radio"
              value="eraser"
              checked={tool === "eraser"}
              onChange={handleToolChange}
              disabled={isEraserDisabled}
            />
            <span>Eraser</span>
          </Label>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="color"
            className="rounded-full border w-10 h-10 cursor-pointer"
            value={brushColor}
            onChange={handleColorPickerChange}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm">Brush size</span>
            <Slider
              className="w-36 cursor-pointer"
              step={1}
              min={1}
              value={[brushSize]}
              onValueChange={handleBrushSizeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
