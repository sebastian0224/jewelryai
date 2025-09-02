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
        setSelectedImages([]); // Reset selection when reloading
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

    // Filtro por fecha
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

    // Filtro por estilo
    if (styleFilter !== "all") {
      filtered = filtered.filter((image) => image.styleUsed === styleFilter);
    }

    setFilteredImages(filtered);
    // Reset selection when filters change
    setSelectedImages([]);
  }, [images, dateFilter, styleFilter]);

  // Manejar selección individual de imágenes
  const handleImageSelect = (imageId, isSelected) => {
    if (isSelected) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  // Seleccionar/deseleccionar todas las imágenes
  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((img) => img.id));
    }
  };

  // Obtener datos de imágenes seleccionadas
  const getSelectedImagesData = () => {
    return selectedImages
      .map((id) => filteredImages.find((img) => img.id === id))
      .filter(Boolean);
  };

  // Manejar eliminación individual desde modal
  const handleImageDeleted = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => prev.filter((id) => id !== imageId));
  };

  // Confirmar eliminación batch
  const handleDeleteSelected = () => {
    if (selectedImages.length > 0) {
      setShowDeleteDialog(true);
    }
  };

  // Ejecutar eliminación batch
  const executeDeleteBatch = async () => {
    if (!user?.id || selectedImages.length === 0) return;

    setIsDeleting(true);
    try {
      const result = await deleteImagesAction(selectedImages, user.id);

      if (result.success) {
        console.log(`Successfully deleted ${result.deletedCount} images`);

        // Actualizar estado local removiendo imágenes eliminadas
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

  // Obtener estilos únicos para el filtro
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
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
              Todas tus imágenes generadas con IA ({filteredImages.length} de{" "}
              {images.length})
            </p>
          </div>

          <div className="flex gap-3">
            {/* Filtro por fecha */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por estilo */}
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estilos</SelectItem>
                {uniqueStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadImages} disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Batch Actions - Solo mostrar si hay imágenes seleccionadas */}
      {selectedImages.length > 0 && (
        <BatchActionsGallery
          selectedCount={selectedImages.length}
          totalCount={filteredImages.length}
          selectedImages={getSelectedImagesData()}
          onDeleteSelected={handleDeleteSelected}
          isDeleting={isDeleting}
        />
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border animate-pulse"
            >
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadImages}>Try Again</Button>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {images.length === 0
              ? "No tienes imágenes generadas aún"
              : "No hay imágenes que coincidan con los filtros seleccionados"}
          </p>
          {images.length === 0 && (
            <Button asChild>
              <a href="/dashboard">Generate Your First Image</a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              {selectedImages.length} image
              {selectedImages.length > 1 ? "s" : ""}? This action cannot be
              undone and will remove the image
              {selectedImages.length > 1 ? "s" : ""} from both your gallery and
              cloud storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteBatch}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
