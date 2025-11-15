"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Plus, Search, Edit, Trash2, Eye, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articlesService } from "@/lib/api/articles.service";
import { Article } from "@/types/common";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";

interface FormData {
  title: string;
  content: string;
  thumbnailUrl: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    thumbnailUrl: "",
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // TinyMCE editor ref
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, articles]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await articlesService.getAll();
      setArticles(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch articles");
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({ ...formData, thumbnailUrl: "" });
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      const result = await articlesService.uploadImage(file);
      return result.url;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCreate = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("Please fill all required fields");
        return;
      }

      let thumbnailUrl = formData.thumbnailUrl;
      if (selectedImage) {
        toast.loading("Uploading thumbnail...", { id: 'upload' });
        try {
          thumbnailUrl = await uploadImage(selectedImage);
          toast.success("Thumbnail uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload thumbnail", { id: 'upload' });
          return;
        }
      }

      const slug = generateSlug(formData.title);

      await articlesService.create({
        title: formData.title,
        slug,
        content: formData.content,
        thumbnailUrl: thumbnailUrl || undefined,
      });
      
      toast.success("Article created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create article");
    }
  };

  const handleUpdate = async () => {
    if (!selectedArticle) return;

    try {
      let thumbnailUrl = formData.thumbnailUrl;
      if (selectedImage) {
        toast.loading("Uploading thumbnail...", { id: 'upload' });
        try {
          thumbnailUrl = await uploadImage(selectedImage);
          toast.success("Thumbnail uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload thumbnail. Keeping previous thumbnail.", { id: 'upload' });
          thumbnailUrl = selectedArticle.thumbnailUrl || "";
        }
      }

      await articlesService.update(selectedArticle.id, {
        title: formData.title,
        content: formData.content,
        thumbnailUrl: thumbnailUrl || undefined,
      });
      
      toast.success("Article updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedArticle(null);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update article");
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

    try {
      await articlesService.delete(selectedArticle.id);
      toast.success("Article deleted successfully");
      setShowDeleteModal(false);
      setSelectedArticle(null);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete article");
    }
  };

  const openEditModal = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      thumbnailUrl: article.thumbnailUrl || "",
    });
    setImagePreview(article.thumbnailUrl || "");
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (article: Article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const openDetailModal = (article: Article) => {
    setSelectedArticle(article);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      thumbnailUrl: "",
    });
    setSelectedImage(null);
    setImagePreview("");
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, content });
  };

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
        <Button 
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Articles</p>
              <p className="text-xl font-bold text-white">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">With Thumbnails</p>
              <p className="text-xl font-bold text-white">
                {articles.filter(a => a.thumbnailUrl).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Recent (7 days)</p>
              <p className="text-xl font-bold text-white">
                {articles.filter(a => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(a.createdAt) > weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search articles by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading articles...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredArticles.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-white/10 bg-[#171717]">
          <FileText className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No articles found</h3>
          <p className="mt-2 text-sm text-gray-400">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by creating your first article"}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all"
            >
              {article.thumbnailUrl && (
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
              <div 
                className="text-sm text-gray-400 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              <div className="flex items-center justify-between pt-3 border-t border-white/10 mb-3">
                <span className="text-xs text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                  by {article.author?.nama_panggilan || 'Unknown'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailModal(article)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-white/5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(article)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2 rounded-lg hover:bg-emerald-500/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(article)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors py-2 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-4xl w-full my-8">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#171717] z-10">
              <h2 className="text-xl font-bold text-white">Create New Article</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter article title..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content * (Rich Text Editor)</label>
                <div className="bg-white rounded-lg">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image media link | code | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      images_upload_handler: async (blobInfo: any) => {
                        try {
                          const file = blobInfo.blob() as File;
                          const url = await uploadImage(file);
                          return url;
                        } catch (error) {
                          throw new Error('Image upload failed');
                        }
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Thumbnail
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-black/50 rounded-full p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3 sticky bottom-0 bg-[#171717]">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Create Article'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-4xl w-full my-8">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#171717] z-10">
              <h2 className="text-xl font-bold text-white">Edit Article</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Rich Text Editor)</label>
                <div className="bg-white rounded-lg">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image media link | code | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      images_upload_handler: async (blobInfo: any) => {
                        try {
                          const file = blobInfo.blob() as File;
                          const url = await uploadImage(file);
                          return url;
                        } catch (error) {
                          throw new Error('Image upload failed');
                        }
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="thumbnail-upload-edit"
                  />
                  <label
                    htmlFor="thumbnail-upload-edit"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Thumbnail
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-black/50 rounded-full p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3 sticky bottom-0 bg-[#171717]">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Update Article'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Article</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedArticle.title}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-4xl w-full my-8">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#171717] z-10">
              <h2 className="text-xl font-bold text-white">Article Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {selectedArticle.thumbnailUrl && (
                <img
                  src={selectedArticle.thumbnailUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{selectedArticle.title}</h3>
                <div className="flex gap-4 text-sm text-gray-400 mb-4">
                  <span>By {selectedArticle.author?.nama_panggilan || 'Unknown'}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Slug: {selectedArticle.slug}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                <div 
                  className="prose prose-invert max-w-none text-white"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
                <div>
                  <label className="block text-gray-400 mb-1">Created At</label>
                  <p className="text-white">{new Date(selectedArticle.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Updated At</label>
                  <p className="text-white">{new Date(selectedArticle.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 sticky bottom-0 bg-[#171717]">
              <Button onClick={() => setShowDetailModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
