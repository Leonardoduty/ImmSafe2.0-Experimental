"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PostCard from "./PostCard"
import type { Post, Comment } from "@/types"

const STORAGE_KEY = "community_posts"

function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPosts(JSON.parse(stored))
      } catch {
        console.error("Failed to parse stored posts")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return

    const newPost: Post = {
      id: generateId(),
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      comments: []
    }

    setPosts(prev => [newPost, ...prev])
    setContent("")
    setShowForm(false)
  }

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    )
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
          : post
      )
    )
  }

  const exportToJSON = () => {
    if (posts.length === 0) return

    const dataStr = JSON.stringify(posts, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `community_posts_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Community Feed</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToJSON} disabled={posts.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {showForm ? "Cancel" : "New Post"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Create Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Your name"
                value={author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
              />
              <Textarea
                placeholder="What's on your mind? Share updates, ask for help, or offer support..."
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={!author.trim() || !content.trim()}>
                  Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No posts yet. Be the first to share something with the community!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  )
}
