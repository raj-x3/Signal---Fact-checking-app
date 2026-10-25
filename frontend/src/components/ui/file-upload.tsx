import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconUpload, IconX, IconFileText, IconCheck, IconPhoto } from '@tabler/icons-react';

export const FileUpload = ({
  onChange,
  accept = 'image/*,.pdf',
  maxFiles = 1,
}: {
  onChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const updated = [...newFiles.slice(0, maxFiles)];
    setFiles(updated);
    onChange && onChange(updated);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange && onChange(updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Outer Thin Container with Continuous Flowing Black Liquid Border */}
      <div className="relative rounded-2xl p-[1.5px] overflow-hidden group/file transition-all duration-300 shadow-2xs hover:shadow-md">
        
        {/* Base thin hairline track */}
        <div className="absolute inset-0 bg-slate-200/90 pointer-events-none" />

        {/* Continuous Black Liquid Flow (Viscous Ink Stream 1) */}
        <div className="absolute inset-[-200%] animate-liquid-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_160deg,rgba(39,39,42,0.25)_220deg,rgba(9,9,11,0.75)_290deg,#000000_360deg)] pointer-events-none" />

        {/* Continuous Black Liquid Flow (Viscous Ink Stream 2, 180° offset) */}
        <div className="absolute inset-[-200%] animate-liquid-border bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,transparent_180deg,rgba(24,24,27,0.3)_240deg,#09090b_320deg,#000000_360deg)] pointer-events-none opacity-80" />

        {/* Inner File Uploader Surface */}
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          whileHover="animate"
          className={`relative rounded-[14.5px] p-6 sm:p-8 cursor-pointer w-full overflow-hidden transition-colors duration-300 ${
            isDragOver
              ? 'bg-blue-50/70 shadow-inner'
              : 'bg-slate-50/70 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileChange(Array.from(e.target.files));
              }
            }}
          />

          {/* Subtle Aceternity Grid Pattern */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none opacity-40 bg-grid-subtle" />

          <div className="flex flex-col items-center justify-center relative z-10">
            <motion.div
              layout
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover/file:scale-110 group-hover/file:border-blue-300 transition-all duration-300"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <IconUpload className="w-6 h-6 stroke-[1.8]" />
              </motion.div>
            </motion.div>

            <p className="font-bold text-slate-800 text-sm tracking-tight text-center">
              Upload screenshot or document
            </p>
            <p className="font-normal text-slate-500 text-xs mt-1 text-center">
              Drag and drop your claim artifact, viral screenshot, or press report
            </p>

            <div className="relative w-full mt-6 max-w-xl mx-auto">
              {files.length > 0 ? (
                <div className="space-y-2">
                  <AnimatePresence>
                    {files.map((file, idx) => (
                      <motion.div
                        key={`file-${idx}-${file.name}`}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative overflow-hidden z-20 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-blue-200 shadow-md shadow-blue-500/5 gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            {file.type.startsWith('image/') ? (
                              <IconPhoto className="w-5 h-5 stroke-[1.8]" />
                            ) : (
                              <IconFileText className="w-5 h-5 stroke-[1.8]" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                              <span>·</span>
                              <span className="text-cyan-600 font-medium flex items-center gap-0.5">
                                <IconCheck className="w-3 h-3" /> Ready for OCR
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleRemove(e, idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                          title="Remove file"
                        >
                          <IconX className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  layoutId="file-upload-placeholder"
                  variants={{
                    initial: { scale: 1 },
                    animate: { scale: 1.02, y: -2 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative z-10 bg-white/80 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Supports PNG, JPG, WebP, PDF up to 25MB</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                    Multimodal Analysis
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
