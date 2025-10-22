// src/pages/post/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PostForm from "../../components/PostForm";
import formatDate from "../../utils/formatDate";

export default function PostDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) fetchPost();
    // eslint-disable-next-line
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPost({ id: docSnap.id, ...docSnap.data() });
    } else {
      setPost(null);
    }
    setLoading(false);
  }

  async function handleUpdatePost(updatedFields) {
    setUpdateLoading(true);
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { ...updatedFields });
    await fetchPost();
    setEditing(false);
    setUpdateLoading(false);
  }

  async function handleDeletePost() {
    setUpdateLoading(true);
    await deleteDoc(doc(db, "posts", id));
    setUpdateLoading(false);
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col glass bg-gradient-to-tl from-fuchsia-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 text-center text-lg animate-pulse-slow">Loading...</main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col glass bg-gradient-to-tl from-fuchsia-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="text-2xl text-gray-500 font-medium">Post not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAuthor = user && user.email === post.authorEmail;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-fuchsia-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        {editing ? (
          <PostForm
            initialData={{ title: post.title, content: post.content }}
            onSubmit={handleUpdatePost}
            loading={updateLoading}
          />
        ) : (
          <article className="glass bento w-full bg-white/70 dark:bg-gray-900/85 rounded-3xl shadow-xl border border-fuchsia-200 dark:border-blue-900 p-8 sm:p-10 mb-7 transition-all animate-fade-in relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
                />
              ) : (
                <span className="inline-flex w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-fuchsia-400 text-white font-bold text-2xl items-center justify-center shadow">{post.author?.[0]?.toUpperCase() || "?"}</span>
              )}
              <span className="font-semibold text-md text-gray-700 dark:text-gray-200">{post.author}</span>
              <span className="ml-auto text-xs text-blue-400 dark:text-pink-200">{formatDate(post.createdAt)}</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-fuchsia-500 bg-clip-text text-transparent">{post.title}</h1>
            <div className="whitespace-pre-line text-lg font-medium text-gray-700 dark:text-gray-100 mb-6">
              {post.content}
            </div>
            {isAuthor && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteDialog(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        )}
        {/* Delete confirmation modal */}
        {deleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-[92vw] max-w-md ring-2 ring-fuchsia-100/80 dark:ring-blue-900">
              <div className="font-bold text-xl mb-2 text-red-500">Delete Post?</div>
              <div className="mb-4 text-gray-600 dark:text-gray-200">This action cannot be undone.</div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteDialog(false)}
                  className="px-4 py-2 rounded font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={updateLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-400 text-white font-bold shadow transition-all hover:scale-105 disabled:opacity-50"
                >
                  {updateLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
