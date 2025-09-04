"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getUserImagesAction,
  deleteImagesAction,
} from "@/lib/actions/gallery-actions";
import { ImageCard } from "@/components/dashboard/Gallery/ImageCard";
import { BatchActionsGallery } from "@/components/dashboard/Gallery/BatchActionsGallery";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function GalleryPage() {
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadImages = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getUserImagesAction(user.id);
      if (result.success) {
        setImages(result.images);
        setFilteredImages(result.images);
        setSelectedImages([]);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadImages();
    }
  }, [user?.id]);

  // Filtrar imágenes cuando cambien los filtros
  useEffect(() => {
    let filtered = [...images];

    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (image) => new Date(image.createdAt) >= filterDate
      );
    }

    if (styleFilter !== "all") {
      filtered = filtered.filter((image) => image.styleUsed === styleFilter);
    }

    setFilteredImages(filtered);
    setSelectedImages([]);
  }, [images, dateFilter, styleFilter]);

  const handleImageSelect = (imageId, isSelected) => {
    if (isSelected) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((img) => img.id));
    }
  };

  const getSelectedImagesData = () => {
    return selectedImages
      .map((id) => filteredImages.find((img) => img.id === id))
      .filter(Boolean);
  };

  const handleImageDeleted = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => prev.filter((id) => id !== imageId));
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length > 0) {
      setShowDeleteDialog(true);
    }
  };

  const executeDeleteBatch = async () => {
    if (!user?.id || selectedImages.length === 0) return;

    setIsDeleting(true);
    try {
      const result = await deleteImagesAction(selectedImages, user.id);

      if (result.success) {
        console.log(`Successfully deleted ${result.deletedCount} images`);
        setImages((prev) =>
          prev.filter((img) => !selectedImages.includes(img.id))
        );
        setSelectedImages([]);
        setShowDeleteDialog(false);
      } else {
        console.error("Batch delete failed:", result.error);
        alert("Failed to delete images. Please try again.");
      }
    } catch (error) {
      console.error("Batch delete failed:", error);
      alert("Failed to delete images. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueStyles = [...new Set(images.map((img) => img.styleUsed))].filter(
    Boolean
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section - Responsive */}
      <div className="border-b border-border pb-4 sm:pb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-end sm:space-y-0">
          {/* Title Section */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
              Gallery
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              All your AI generated images ({filteredImages.length} of{" "}
              {images.length})
            </p>
          </div>

          {/* Filters Section - Responsive */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:gap-3 sm:space-y-0">
            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            {/* Style Filter */}
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All styles</SelectItem>
                {uniqueStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={loadImages}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              <span className="sm:hidden">Refresh Images</span>
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Batch Actions - Responsive */}
      {selectedImages.length > 0 && (
        <BatchActionsGallery
          selectedCount={selectedImages.length}
          totalCount={filteredImages.length}
          selectedImages={getSelectedImagesData()}
          onDeleteSelected={handleDeleteSelected}
          isDeleting={isDeleting}
        />
      )}

      {/* Content Section */}
      {loading ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            {error}
          </p>
          <Button onClick={loadImages}>Try Again</Button>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            {images.length === 0
              ? "No generated images yet"
              : "No images match the selected filters"}
          </p>
          {images.length === 0 && (
            <Button asChild>
              <a href="/dashboard">Generate Your First Image</a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isSelected={selectedImages.includes(image.id)}
              onSelect={(isSelected) => handleImageSelect(image.id, isSelected)}
              onImageDeleted={handleImageDeleted}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to permanently delete{" "}
              {selectedImages.length} image
              {selectedImages.length > 1 ? "s" : ""}? This action cannot be
              undone and will remove the image
              {selectedImages.length > 1 ? "s" : ""} from both your gallery and
              cloud storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteBatch}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? "Deleting..."
                : `Delete ${selectedImages.length} Image${
                    selectedImages.length > 1 ? "s" : ""
                  }`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
