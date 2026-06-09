"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blog" | "contacts" | "settings">("blog");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[900px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
              admin
            </p>
            <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-medium italic leading-[1.1] text-ink">
              dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-pixel text-sm text-whisper transition-colors hover:text-rose"
            >
              ← site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="font-pixel text-sm text-whisper transition-colors hover:text-rose disabled:opacity-50"
            >
              {loggingOut ? "..." : "logout"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-(--shadow)">
          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 font-pixel text-sm transition-colors ${
              activeTab === "blog"
                ? "border-b-2 border-rose text-rose"
                : "text-whisper hover:text-ink"
            }`}
          >
            blog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`px-4 py-2 font-pixel text-sm transition-colors ${
              activeTab === "contacts"
                ? "border-b-2 border-rose text-rose"
                : "text-whisper hover:text-ink"
            }`}
          >
            contacts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-pixel text-sm transition-colors ${
              activeTab === "settings"
                ? "border-b-2 border-rose text-rose"
                : "text-whisper hover:text-ink"
            }`}
          >
            settings
          </button>
        </div>

        {/* Content */}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "contacts" && <ContactsManager />}
        {activeTab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

function BlogManager() {
  const [posts, setPosts] = useState([
    {
      id: "1",
      slug: "hello-world",
      title: "hello, world",
      date: "coming soon",
      excerpt: "the first field note will appear here when i'm ready to share it.",
      tags: ["meta", "intro"],
      published: false,
    },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", excerpt: "", tags: "" });

  const startEdit = (post: (typeof posts)[0]) => {
    setEditing(post.id);
    setEditForm({
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags.join(", "),
    });
  };

  const saveEdit = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              title: editForm.title,
              excerpt: editForm.excerpt,
              tags: editForm.tags.split(",").map((t) => t.trim()),
            }
          : p
      )
    );
    setEditing(null);
  };

  const togglePublish = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          className="rounded-btn bg-rose px-4 py-2 font-pixel text-sm text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
        >
          + new post
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-card border border-(--shadow) bg-bg-card p-5"
          >
            {editing === post.id ? (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-btn border border-(--shadow) bg-bg-linen px-3 py-2 font-serif text-lg italic text-ink outline-none focus:border-rose"
                  placeholder="Post title"
                />
                <textarea
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="min-h-[100px] w-full resize-none rounded-btn border border-(--shadow) bg-bg-linen px-3 py-2 font-mono text-sm text-ink outline-none focus:border-rose"
                  placeholder="Excerpt..."
                />
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="w-full rounded-btn border border-(--shadow) bg-bg-linen px-3 py-2 font-mono text-sm text-ink outline-none focus:border-rose"
                  placeholder="Tags (comma separated)"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEdit(post.id)}
                    className="rounded-btn bg-moss px-4 py-2 font-pixel text-sm text-bg-linen"
                  >
                    save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-btn border border-(--shadow) px-4 py-2 font-pixel text-sm text-whisper"
                  >
                    cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl italic text-ink">{post.title}</h3>
                    <p className="font-mono text-xs text-whisper">{post.date}</p>
                  </div>
                  <span
                    className={`rounded-pill px-2 py-0.5 font-pixel text-[10px] uppercase ${
                      post.published ? "bg-moss/20 text-moss" : "bg-whisper/20 text-whisper"
                    }`}
                  >
                    {post.published ? "published" : "draft"}
                  </span>
                </div>
                <p className="mb-3 font-mono text-sm text-ink/80">{post.excerpt}</p>
                <div className="mb-4 flex flex-wrap gap-1">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-pill border border-(--shadow) px-2 py-0.5 font-mono text-[10px] text-whisper"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="font-pixel text-sm text-rose transition-colors hover:text-rose-deep"
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(post.id)}
                    className="font-pixel text-sm text-whisper transition-colors hover:text-ink"
                  >
                    {post.published ? "unpublish" : "publish"}
                  </button>
                  <button
                    type="button"
                    className="font-pixel text-sm text-whisper transition-colors hover:text-rose"
                  >
                    delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center font-mono text-xs italic text-whisper">
        note: blog posts require database connection to persist
      </p>
    </div>
  );
}

function ContactsManager() {
  const [contacts, setContacts] = useState<
    { id: string; name: string; email: string | null; message: string; created_at: string; read: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      } else {
        setError("Failed to load contacts");
      }
    } catch {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  const markRead = async (id: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setContacts(contacts.map((c) => (c.id === id ? { ...c, read: true } : c)));
  };

  if (loading) {
    return <p className="text-center font-mono text-sm text-whisper">loading contacts...</p>;
  }

  if (error) {
    return <p className="text-center font-mono text-sm text-rose">{error}</p>;
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-card border border-(--shadow) bg-bg-card p-6 text-center">
        <p className="font-mono text-sm text-whisper">no contact submissions yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`rounded-card border border-(--shadow) bg-bg-card p-5 ${
            !contact.read ? "border-l-4 border-l-rose" : ""
          }`}
        >
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-serif text-lg italic text-ink">{contact.name}</h3>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="font-mono text-xs text-rose hover:underline"
                >
                  {contact.email}
                </a>
              )}
            </div>
            <span className="font-mono text-[10px] text-whisper">
              {new Date(contact.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="mb-3 whitespace-pre-wrap font-mono text-sm text-ink/80">
            {contact.message}
          </p>
          {!contact.read && (
            <button
              type="button"
              onClick={() => markRead(contact.id)}
              className="font-pixel text-sm text-whisper transition-colors hover:text-ink"
            >
              mark read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="rounded-card border border-(--shadow) bg-bg-card p-6">
      <h3 className="mb-4 font-pixel text-sm uppercase tracking-wider text-rose">
        site settings
      </h3>
      <p className="font-mono text-sm text-whisper">
        settings panel coming soon. this will allow you to configure site metadata, social links,
        and more.
      </p>
    </div>
  );
}
