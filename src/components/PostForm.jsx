// src/components/PostForm.jsx
import { useState } from "react";
import { FaHeading, FaPenFancy } from "react-icons/fa";

export default function PostForm({ initialData = {}, onSubmit, loading }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content });
  };

  return (
    <form
      className="
        bg-white/60 dark:bg-gray-900/80
        backdrop-blur-lg border border-fuchsia-200 dark:border-blue-900
        shadow-2xl rounded-3xl px-8 py-10 flex flex-col gap-7 w-full max-w-2xl mx-auto
        animate-fade-in
      "
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="text-3xl text-center font-extrabold mb-2 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent drop-shadow">
        {initialData.title ? "Edit your Post ✏️" : "Create a New Post 📝"}
      </div>
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="relative">
          <FaHeading className="absolute left-3 top-3 text-blue-400 text-lg pointer-events-none" />
          <input
            type="text"
            className="
              w-full pl-10 pr-3 py-3 rounded-xl text-lg
              bg-gray-100 dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-400
              font-semibold placeholder-gray-400 dark:placeholder-gray-500
              shadow
              transition
            "
            placeholder="Post Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={120}
            disabled={loading}
          />
        </div>
        {/* Content */}
        <div className="relative">
          <FaPenFancy className="absolute left-3 top-3 text-fuchsia-400 text-lg pointer-events-none" />
          <textarea
            className="
              w-full pl-10 pr-3 py-3 min-h-[120px] rounded-xl text-base
              bg-gray-100 dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-pink-400
              font-medium placeholder-gray-400 dark:placeholder-gray-500
              shadow
              transition resize-y
            "
            placeholder="Write your brilliant thoughts..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            maxLength={4000}
            disabled={loading}
          />
        </div>
      </div>
      <button
        type="submit"
        className={`
          mt-2 w-full py-3 rounded-xl font-bold text-lg shadow-xl
          bg-gradient-to-tr from-fuchsia-500 via-blue-500 to-cyan-400
          text-white
          hover:from-fuchsia-600 hover:to-blue-600
          active:scale-95
          transition-all
          ${loading ? "opacity-60" : ""}
        `}
        disabled={loading}
      >
        {loading ? "Submitting..." : (initialData.title ? "Save Changes" : "Create Post")}
      </button>
    </form>
  );
}
