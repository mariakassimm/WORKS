import { useCallback, useRef, useState } from "react";
import { uploadImages, deleteImage as deleteImageApi } from "../../services/api";

/**
 * Beautiful, simple drag-and-drop image uploader for non-technical admins.
 * images: [{ url, publicId, isMain }]
 * onChange(newImages)
 */
export default function ImageUploader({ images = [], onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;
      setError("");
      setUploading(true);
      setProgress(0);
      try {
        const data = await uploadImages(files, setProgress);
        const newImages = [...images, ...data.images];
        if (!newImages.some((img) => img.isMain) && newImages.length > 0) {
          newImages[0].isMain = true;
        }
        onChange(newImages);
      } catch (err) {
        console.error("Image upload failed:", err);
        setError("Image couldn't be uploaded. Please try again.");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [images, onChange]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const setMain = (idx) => {
    const updated = images.map((img, i) => ({ ...img, isMain: i === idx }));
    onChange(updated);
  };

  const removeImage = async (idx) => {
    const img = images[idx];
    const updated = images.filter((_, i) => i !== idx);
    if (img.isMain && updated.length > 0) updated[0].isMain = true;
    onChange(updated);
    if (img.publicId) {
      try {
        await deleteImageApi(img.publicId);
      } catch {
        // Non-fatal — the image reference is already removed from the product.
      }
    }
  };

  const moveImage = (idx, direction) => {
    const target = idx + direction;
    if (target < 0 || target >= images.length) return;
    const updated = [...images];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    onChange(updated);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-burgundy bg-burgundy/5" : "border-steel hover:border-ash"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-ash" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-display text-sm text-alloy">Drag images here, or click to upload</p>
        <p className="text-xs text-ash">JPG, PNG or WEBP — up to 8MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-steel">
            <div className="h-1.5 bg-burgundy transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ash">Uploading… {progress}%</p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rust">{error}</p>}

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div key={img.publicId || img.url} className={`group relative border ${img.isMain ? "border-burgundy" : "border-steel"}`}>
              <img src={img.url} alt={`Product ${idx + 1}`} className="aspect-square w-full object-cover" />
              {img.isMain && (
                <span className="absolute left-1 top-1 bg-burgundy px-1.5 py-0.5 text-[10px] font-display font-semibold text-alloy">MAIN</span>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-onyx/80 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isMain && (
                  <button type="button" onClick={() => setMain(idx)} className="px-2 py-1 text-[11px] font-display text-alloy hover:text-crimson">
                    Set as main
                  </button>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveImage(idx, -1)} className="px-1.5 py-1 text-[11px] text-alloy hover:text-crimson">←</button>
                  <button type="button" onClick={() => moveImage(idx, 1)} className="px-1.5 py-1 text-[11px] text-alloy hover:text-crimson">→</button>
                </div>
                <button type="button" onClick={() => removeImage(idx)} className="px-2 py-1 text-[11px] font-display text-rust hover:text-alloy">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
