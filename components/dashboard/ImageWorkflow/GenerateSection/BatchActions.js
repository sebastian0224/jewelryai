"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BatchActions({
  selectedCount,
  totalCount,
  onSelectAll,
  selectedImages,
}) {
  const handleBatchSave = () => {
    console.log("Batch saving:", selectedImages);
    // Add batch save logic here
  };

  const handleBatchDownload = () => {
    console.log("Batch downloading:", selectedImages);
    // Add batch download logic here
  };

  const handleBatchDiscard = () => {
    console.log("Batch discarding:", selectedImages);
    // Add batch discard logic here
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              {selectedCount === totalCount ? "Deselect All" : "Select All"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedCount} of {totalCount} selected
            </span>
          </div>

          {/* Batch Actions */}
          {selectedCount > 0 && (
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleBatchSave} className="px-4">
                💾 Save ({selectedCount})
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBatchDownload}
                className="px-4 bg-transparent"
              >
                ⬇️ Download ({selectedCount})
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBatchDiscard}
                className="px-4"
              >
                🗑️ Discard ({selectedCount})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
