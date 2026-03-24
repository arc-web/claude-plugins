import { Button } from "@/components/ui/button";

interface GraphControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function GraphControls({ zoom, onZoomIn, onZoomOut, onZoomReset }: GraphControlsProps) {
  return (
    <div className="absolute bottom-3 right-3 flex gap-1 z-10">
      <Button variant="outline" size="icon-sm" onClick={onZoomOut} title="Zoom out">
        −
      </Button>
      <Button variant="outline" size="icon-sm" onClick={onZoomReset} title={`Reset (${Math.round(zoom * 100)}%)`}>
        ⟳
      </Button>
      <Button variant="outline" size="icon-sm" onClick={onZoomIn} title="Zoom in">
        +
      </Button>
    </div>
  );
}
