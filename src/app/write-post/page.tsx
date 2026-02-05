"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { createPost, fetchPostById, updatePost } from "@/features/posts/api";
import Menu from "@/components/ui/Menu";
import "quill/dist/quill.snow.css";

export default function WritePostPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-gray-500">Loading Editor...</div>
      }
    >
      <WritePostForm />
    </Suspense>
  );
}

function WritePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
  });

  const [payload, setPayload] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    image: null as File | string | null,
  });

  useEffect(() => {
    const initQuill = async () => {
      const Quill = (await import("quill")).default;
      if (editorRef.current && !quillInstance.current) {
        quillInstance.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Enter your content",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "strike", "italic"],
              [{ list: "bullet" }, { list: "ordered" }],
              [{ align: [] }],
              ["link", "image"],
              ["clean"],
            ],
          },
        });
      }
    };
    initQuill();
  }, []);

  useEffect(() => {
    if (!editId) return;
    const loadData = async () => {
      try {
        const res = await fetchPostById(editId);
        const post = res.data || res;
        if (post) {
          setPayload({
            title: post.title || "",
            content: post.content || "",
            tags: Array.isArray(post.tags)
              ? post.tags.map((t: any) => (typeof t === "string" ? t : t.name))
              : [],
            image: post.imageUrl || null,
          });
          setImagePreview(post.imageUrl || null);
          if (quillInstance.current)
            quillInstance.current.root.innerHTML = post.content || "";
        }
      } catch (err) {
        router.push("/profile");
      }
    };
    loadData();
  }, [editId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPayload({ ...payload, image: file });
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) setErrors({ ...errors, image: "" });
    }
  };

  const handleSave = async () => {
    const newErrors = { title: "", content: "", image: "", tags: "" };
    let hasError = false;

    const contentHtml = quillInstance.current?.root.innerHTML || "";
    const plainText = quillInstance.current?.getText().trim() || "";

    if (!payload.title.trim()) {
      newErrors.title = "Title is required";
      hasError = true;
    }
    if (!plainText || plainText === "") {
      newErrors.content = "Content cannot be empty";
      hasError = true;
    }
    if (!payload.image) {
      newErrors.image = "Cover image is required";
      hasError = true;
    }
    if (payload.tags.length === 0) {
      newErrors.tags = "Add at least one tag";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);
    try {
      const dataToSend = {
        title: payload.title,
        content: contentHtml,
        tags: payload.tags.join(","),
        image: payload.image,
      };

      if (editId) {
        await updatePost(Number(editId), dataToSend);
      } else {
        await createPost(dataToSend as any);
      }
      router.push("/profile");
    } catch (err) {
      console.error("Gagal simpan:", err);
      alert("Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBorderClass = (errorField: string) =>
    errorField ? "border-[#F675A8]" : "border-gray-200 focus:border-black";

  return (
    <div className="w-full flex flex-col items-center border px-4  md:px-30">
      <header className=" w-full max-w-360 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <IoArrowBackOutline size={20} />
          </button>
          <h1 className="font-bold text-lg">
            {editId ? "Edit Post" : "Write Post"}
          </h1>
        </div>
        <Menu />
      </header>

      <main className="max-w-200 w-full flex flex-col pt-20">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-gray-700">Title</label>
          <input
            type="text"
            className={`w-full border rounded-xl p-4 text-[14px] outline-none transition-all ${getBorderClass(errors.title)}`}
            value={payload.title}
            onChange={(e) => {
              setPayload({ ...payload, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            placeholder="Enter your title"
          />
          {errors.title && (
            <p className="text-[11px] text-[#F675A8] font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-gray-700">Content</label>
          <div
            className={`border rounded-xl overflow-hidden transition-all ${getBorderClass(errors.content)}`}
          >
            <div ref={editorRef} className="min-h-75" />
          </div>
          {errors.content && (
            <p className="text-[11px] text-[#F675A8] font-medium">
              {errors.content}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-gray-700">
            Cover Image
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 bg-white flex flex-col items-center justify-center cursor-pointer transition-all ${errors.image ? "border-[#F675A8] bg-red-50/10" : "border-gray-200 hover:bg-gray-50"}`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                className="max-h-50 rounded-lg mb-2"
                alt="Preview"
              />
            ) : (
              <>
                <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center mb-4 text-gray-400">
                  <FiUploadCloud size={24} />
                </div>
                <p className="text-[14px] font-medium text-gray-700">
                  <span className="text-[#0093DD]">Click to upload</span> or
                  drag and drop
                </p>
              </>
            )}
            <p className="text-[12px] text-gray-400 mt-2">
              PNG or JPG (max. 5mb)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {errors.image && (
            <p className="text-[11px] text-[#F675A8] font-medium">
              {errors.image}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-gray-700">Tags</label>
          <div
            className={`w-full border rounded-xl p-4 flex flex-wrap gap-2 items-center bg-white transition-all ${getBorderClass(errors.tags)}`}
          >
            {payload.tags.map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-[13px]"
              >
                {tag}
                <FiX
                  className="cursor-pointer hover:text-red-500"
                  onClick={() =>
                    setPayload({
                      ...payload,
                      tags: payload.tags.filter((_, idx) => idx !== i),
                    })
                  }
                />
              </div>
            ))}
            <input
              type="text"
              className="flex-1 outline-none text-[14px]"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  if (!payload.tags.includes(tagInput.trim())) {
                    setPayload({
                      ...payload,
                      tags: [...payload.tags, tagInput.trim()],
                    });
                    if (errors.tags) setErrors({ ...errors, tags: "" });
                  }
                  setTagInput("");
                }
              }}
              placeholder="Enter your tags"
            />
          </div>
          {errors.tags && (
            <p className="text-[11px] text-[#F675A8] font-medium">
              {errors.tags}
            </p>
          )}
        </div>

        {/* Finish Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full md:w-70 bg-[#0093DD] hover:bg-[#0082c4] text-white py-3.5 rounded-full font-bold text-[15px] shadow-lg transition-all active:scale-[0.95] disabled:bg-gray-300"
          >
            {isLoading ? "Saving..." : "Finish"}
          </button>
        </div>
      </main>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor {
          min-height: 250px;
          font-size: 14px;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
