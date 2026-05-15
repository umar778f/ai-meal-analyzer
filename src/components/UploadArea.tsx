import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion } from "motion/react";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";

export function UploadArea({ onImageReady, isAnalyzing }: { onImageReady: (base64: string) => void; isAnalyzing: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageReady(base64);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    disabled: isAnalyzing,
    multiple: false
  } as any);

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] hover:border-emerald-400/50 group
            ${isDragActive ? "border-emerald-400/50 bg-emerald-400/5" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className={`w-8 h-8 ${isDragActive ? "text-emerald-400" : "text-emerald-400/80"}`} />
          </div>
          <p className="text-xl font-medium mb-2">Drag & drop your food photo here</p>
          <p className="text-sm text-gray-400 mb-6">or click to select from your device</p>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 text-white hover:opacity-90 transition-opacity">
            Upload Now
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden glass-panel p-2">
          <img src={preview} alt="Food Preview" className="w-full h-auto max-h-[400px] object-cover rounded-2xl" />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full animate-pulse" />
              </div>
              <p className="mt-4 text-lg font-medium tracking-wide">AI is analyzing your meal...</p>
            </div>
          )}
          
          {!isAnalyzing && (
            <button 
              onClick={() => { setPreview(null); }}
              className="absolute top-4 right-4 bg-dark/50 hover:bg-dark/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
