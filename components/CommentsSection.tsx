"use client"

import { useState } from "react"
import { Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Comment } from "@/types"

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
  onAddComment: (postId: string, comment: Comment) => void
  onDeleteComment: (postId: string, commentId: string) => void
}

function generateId(): string {
  return `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export default function CommentsSection({
  postId,
  comments,
  onAddComment,
  onDeleteComment
}: CommentsSectionProps) {
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return

    const newComment: Comment = {
      id: generateId(),
      postId,
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    onAddComment(postId, newComment)
    setContent("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="mt-3 space-y-3">
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive flex-shrink-0"
                onClick={() => onDeleteComment(postId, comment.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Your name"
          value={author}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
          className="w-24 flex-shrink-0"
        />
        <Input
          placeholder="Write a comment..."
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!author.trim() || !content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
