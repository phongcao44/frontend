/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Upload, X, Eye, Trash2, FileImage, CheckCircle, AlertCircle, Image } from "lucide-react";

const arePropsEqual = (prevProps, nextProps) => {
  const prevFileList = prevProps.fileList;
  const nextFileList = nextProps.fileList;

  if (prevFileList.length !== nextFileList.length) return false;

  return prevFileList.every((file, index) => {
    const nextFile = nextFileList[index];
    return (
      file.uid === nextFile.uid &&
      file.name === nextFile.name &&
      file.status === nextFile.status &&
      file.url === nextFile.url &&
      file.file === nextFile.file &&
      file.variantId === nextFile.variantId &&
      file.isMain === nextFile.isMain
    );
  });
};

const ImageUploadSection = ({ fileList, setFileList }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // Generate previews using useMemo
  const previews = useMemo(() => {
    const newPreviews = fileList.map((file) => {
      if (file.file && file.file instanceof File) {
        const fileType = file.file.type;
        if (fileType.startsWith("image/")) {
          return {
            uid: file.uid,
            url: URL.createObjectURL(file.file),
            isImage: true,
            name: file.name,
            variantId: file.variantId || null,
            isMain: file.isMain || false,
          };
        }
      } else if (file.url) {
        return {
          uid: file.uid,
          url: file.url,
          isImage: true,
          name: file.name || `image-${file.uid}`,
          variantId: file.variantId || null,
          isMain: file.isMain || false,
        };
      }
      return {
        uid: file.uid,
        url: null,
        isImage: false,
        name: file.name || `image-${file.uid}`,
        variantId: file.variantId || null,
        isMain: file.isMain || false,
      };
    });
    return newPreviews;
  }, [fileList]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const validateFile = useCallback(
    (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        showNotification(`${file.name} không phải là file hình ảnh!`, "error");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        showNotification(`${file.name} phải nhỏ hơn 5MB!`, "error");
        return false;
      }

      const isDuplicate = fileList.some((existingFile) => existingFile.name === file.name);
      if (isDuplicate) {
        showNotification(`${file.name} đã tồn tại!`, "error");
        return false;
      }

      return true;
    },
    [fileList, showNotification]
  );

  const handleFiles = useCallback(
    async (files) => {
      setIsUploading(true);
      const validFiles = Array.from(files).filter(validateFile);

      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const newFiles = validFiles.map((file, index) => ({
        uid: `${Date.now()}-${index}`,
        name: file.name,
        file,
        status: "done",
        variantId: null,
        isMain: fileList.length === 0 && index === 0,
      }));

      setFileList((prev) => {
        const updatedList = [...prev, ...newFiles];
        return updatedList;
      });
      setIsUploading(false);
      showNotification(`Đã tải lên ${validFiles.length} file thành công!`, "success");
    },
    [validateFile, setFileList, showNotification, fileList]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = useCallback(
    (uid) => {
      setFileList((prev) => prev.filter((file) => file.uid !== uid));
      setSelectedImage(null);
      showNotification("Đã xóa file thành công", "success");
    },
    [setFileList, showNotification]
  );

  const openImageModal = useCallback((url) => {
    setSelectedImage(url);
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className="mb-8 relative">
      {notification && (
        <div
          className={`
            relative mb-4 px-6 py-4 rounded-xl border-l-4
            ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                : "bg-red-50 border-red-500 text-red-800"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div
        className={`
          relative group transition-all duration-500 ease-out cursor-pointer
          ${dragActive ? "transform scale-102" : "hover:transform hover:scale-101"}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/*"
          multiple
          style={{ display: "none" }}
        />
        <div
          className={`
            relative overflow-hidden rounded-2xl border-2 transition-all duration-500
            backdrop-blur-sm bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/30
            ${
              dragActive
                ? "border-blue-500 bg-gradient-to-br from-blue-50/95 to-purple-100/80 shadow-2xl"
                : "border-gray-300 hover:border-blue-400"
            }
            ${isUploading ? "pointer-events-none" : ""}
          `}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="relative z-10 p-12 text-center">
            <div
              className={`
                mx-auto mb-6 relative
                ${isUploading ? "animate-bounce" : "group-hover:scale-110"}
                transition-transform duration-300
              `}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-24 h-24 flex items-center justify-center shadow-xl">
                {isUploading ? (
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl border-4 border-blue-200 opacity-20 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {isUploading ? "Đang tải lên..." : "Thêm hình ảnh sản phẩm"}
              </h3>
              <p className="text-gray-600 font-medium">
                {isUploading ? "Vui lòng đợi trong giây lát" : "Kéo thả hoặc nhấp để tải lên hình ảnh"}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                <Image className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 font-medium">
                  JPG, PNG, GIF, WebP • Tối đa 5MB
                </span>
              </div>
            </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-600 font-semibold">Đang xử lý...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {fileList.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  Hình ảnh đã tải lên
                </h4>
                <p className="text-sm text-gray-600">
                  {fileList.length} file được chọn
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFileList([]);
                setSelectedImage(null);
                showNotification("Đã xóa tất cả file", "success");
              }}
              className="group px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:scale-105"
            >
              <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {fileList.map((file, index) => {
              const preview = previews.find((p) => p.uid === file.uid);

              return (
                <div
                  key={file.uid}
                  className="group relative bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    {preview?.isImage && preview?.url ? (
                      <>
                        <img
                          src={preview.url}
                          alt={file.name}
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                          onClick={() => openImageModal(preview.url)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <FileImage className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 truncate max-w-full font-medium">
                          {file.name}
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2">
                      {preview?.url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageModal(preview.url);
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-110 backdrop-blur-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.uid);
                    }}
                    className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white border-3 border-white flex items-center justify-center z-30 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-xl hover:scale-110 hover:rotate-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4">
                    <p className="text-white text-xs font-bold truncate drop-shadow-lg">
                      {file.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                      <span className="text-green-300/90 text-xs font-medium">
                        {file.isMain ? "Hình chính" : "Đã tải lên"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-300"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Zoomed image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white border-2 border-white flex items-center justify-center z-50 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-xl hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageUploadSection, arePropsEqual);