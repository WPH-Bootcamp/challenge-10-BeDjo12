"use client";

import React, { useRef, useState } from "react";
import { FiCamera, FiX } from "react-icons/fi";

interface EditProfileProps {
  user: {
    name: string;
    job: string;
    avatarUrl: string;
  };
  onClose: () => void;
  onSave: (
    newData: { name: string; job: string },
    file: File | null,
  ) => Promise<void>;
}

export default function EditProfile({
  user,
  onClose,
  onSave,
}: EditProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.avatarUrl);

  const [formData, setFormData] = useState({
    name: user.name,
    job: user.job,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSave({ name: formData.name, job: formData.job }, selectedFile);
      onClose();
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      alert("Gagal menyimpan profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-neutral-900">Edit Profile</h2>
          <button onClick={onClose}>
            <FiX className="text-xl text-neutral-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={preview}
              className="h-24 w-24 rounded-full object-cover border"
              alt="avatar"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#0093DD] text-white flex items-center justify-center"
            >
              <FiCamera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-700">Name</p>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093DD]/20"
              placeholder="Your Name"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-neutral-700">
              Profile Headline (Job)
            </p>
            <input
              value={formData.job}
              onChange={(e) =>
                setFormData({ ...formData, job: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093DD]/20"
              placeholder="e.g. Frontend Developer"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-full py-2 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#0093DD] text-white rounded-full py-2 disabled:opacity-50 hover:bg-[#007bbd] transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
