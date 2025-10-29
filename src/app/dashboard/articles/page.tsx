import { FileText, Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ArticlesPage() {
  const articles = [
    { id: 1, title: "Tips Memilah Sampah Organik dan Anorganik", author: "Admin", views: 1234, status: "Published", date: "2025-10-25" },
    { id: 2, title: "Manfaat Daur Ulang untuk Lingkungan", author: "Editor", views: 856, status: "Published", date: "2025-10-24" },
    { id: 3, title: "Cara Mengolah Sampah Plastik Menjadi Kerajinan", author: "Admin", views: 542, status: "Draft", date: "2025-10-23" },
    { id: 4, title: "Bank Sampah: Solusi Cerdas Kelola Sampah", author: "Editor", views: 2341, status: "Published", date: "2025-10-22" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Artikel Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage blog posts, news, and educational content
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Create New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Articles</p>
              <p className="text-xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Published</p>
              <p className="text-xl font-bold text-white">67</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Eye className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Views</p>
              <p className="text-xl font-bold text-white">45.2K</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <FileText className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Draft</p>
              <p className="text-xl font-bold text-white">22</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Authors</option>
            <option>Admin</option>
            <option>Editor</option>
          </select>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.status === "Published" 
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}>
                {article.status}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-gray-400 mb-4">by {article.author}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{article.views} views</span>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-gray-400 hover:text-white transition-colors">Edit</button>
                <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
