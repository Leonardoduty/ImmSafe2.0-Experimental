"use client"

import { useState } from "react"
import { MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CommentsSection from "./CommentsSection"
import type { Post, Comment } from "@/types"

interface PostCardProps {
  post: Post
  onDelete: (id: string) => void
  onAddComment: (postId: string, comment: Comment) => void
  onDeleteComment: (postId: string, commentId: string) => void
}

export default function PostCard({ post, onDelete, onAddComment, onDeleteComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{post.author}</p>
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
            </span>
            {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showComments && (
            <CommentsSection
              postId={post.id}
              comments={post.comments}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
