import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AuthService } from "@/lib/auth";
import { ForumService, ForumPost } from "@/lib/forum";
import { useStorageSync } from "@/hooks/useStorageSync";
import { ArrowLeft, Pin, Lock, Trash2, Edit, ThumbsUp, Heart, Flame, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/UserAvatar";
import { UserBadge } from "@/components/UserBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ForoPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  
  // Sync comments and posts in real-time
  const comments = useStorageSync('forum_comments', () => 
    postId ? ForumService.getPostComments(postId) : []
  );
  const allPosts = useStorageSync('forum_posts', () => ForumService.getPosts());

  // Update post when posts change
  useEffect(() => {
    if (!postId) return;
    const postData = ForumService.getPost(postId);
    if (postData) {
      setPost(postData);
    } else {
      toast.error("Post no encontrado");
      navigate("/foro");
    }
  }, [postId, allPosts, navigate]);
  
  // Increment views only once on mount
  useEffect(() => {
    if (postId) {
      ForumService.incrementViews(postId);
    }
  }, []);

  const handleAddComment = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comentar");
      navigate("/auth");
      return;
    }

    if (!post || post.locked) {
      toast.error("Este tema está cerrado");
      return;
    }

    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    ForumService.createComment(post.id, newComment, user);
    setNewComment("");
    toast.success("Comentario añadido");
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editCommentContent.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    ForumService.updateComment(commentId, editCommentContent);
    setEditingCommentId(null);
    setEditCommentContent("");
    toast.success("Comentario actualizado");
  };

  const handleDeleteComment = (commentId: string) => {
    ForumService.deleteComment(commentId);
    toast.success("Comentario eliminado");
  };

  const handleDeletePost = () => {
    if (post) {
      ForumService.deletePost(post.id);
      toast.success("Post eliminado");
      navigate("/foro");
    }
  };

  const handleTogglePin = () => {
    if (post) {
      ForumService.togglePinPost(post.id);
      toast.success(post.pinned ? "Post despineado" : "Post pineado");
    }
  };

  const handleToggleLock = () => {
    if (post) {
      ForumService.toggleLockPost(post.id);
      toast.success(post.locked ? "Tema desbloqueado" : "Tema bloqueado");
    }
  };

  const handleTogglePostReaction = (type: 'like' | 'love' | 'fire') => {
    if (!user) {
      toast.error("Debes iniciar sesión para reaccionar");
      navigate("/auth");
      return;
    }

    if (post) {
      ForumService.togglePostReaction(post.id, user.id, type);
    }
  };

  const handleToggleCommentReaction = (commentId: string, type: 'like' | 'love') => {
    if (!user) {
      toast.error("Debes iniciar sesión para reaccionar");
      navigate("/auth");
      return;
    }

    ForumService.toggleCommentReaction(commentId, user.id, type);
  };

  const canModerate = user && (user.role === 'admin' || user.role === 'moderador');
  const isAuthor = user && post && user.id === post.author_id;

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/foro")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Foro
        </Button>

        <Card className="p-6 border-border mb-6">
          <div className="flex items-start gap-4 mb-4">
            <UserAvatar avatar={post.author_avatar} username={post.author_username} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {post.pinned && <Pin className="w-4 h-4 text-primary" />}
                {post.locked && <Lock className="w-4 h-4 text-destructive" />}
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                  {post.category_name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-foreground">{post.author_username}</span>
                <UserBadge role={post.author_role as any} />
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {post.views} vistas
                </span>
              </div>
            </div>

            {(canModerate || isAuthor) && (
              <div className="flex gap-2">
                {canModerate && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePin}
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleLock}
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {(canModerate || isAuthor) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePost}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${post.title} - Imagen ${idx + 1}`}
                    className="w-full rounded-lg border border-border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            <Button
              variant={post.reactions.like.includes(user?.id || '') ? "default" : "outline"}
              size="sm"
              onClick={() => handleTogglePostReaction('like')}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {post.reactions.like.length}
            </Button>
            <Button
              variant={post.reactions.love.includes(user?.id || '') ? "default" : "outline"}
              size="sm"
              onClick={() => handleTogglePostReaction('love')}
            >
              <Heart className="w-4 h-4 mr-1" />
              {post.reactions.love.length}
            </Button>
            <Button
              variant={post.reactions.fire.includes(user?.id || '') ? "default" : "outline"}
              size="sm"
              onClick={() => handleTogglePostReaction('fire')}
            >
              <Flame className="w-4 h-4 mr-1" />
              {post.reactions.fire.length}
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Comentarios ({comments.length})
          </h2>

          {!post.locked && user && (
            <Card className="p-4 border-border">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleAddComment}>Comentar</Button>
            </Card>
          )}

          {post.locked && (
            <Card className="p-4 border-border bg-destructive/10">
              <p className="text-destructive flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Este tema está cerrado y no se pueden añadir más comentarios
              </p>
            </Card>
          )}

          {comments.map((comment) => (
            <Card key={comment.id} className="p-4 border-border">
              {editingCommentId === comment.id ? (
                <div>
                  <Textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditCommentContent("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-3">
                    <UserAvatar avatar={comment.author_avatar} username={comment.author_username} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{comment.author_username}</p>
                        <UserBadge role={comment.author_role as any} />
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    {(canModerate || (user && user.id === comment.author_id)) && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditCommentContent(comment.content);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteComment(comment.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-11">
                    <Button
                      variant={comment.reactions.like.includes(user?.id || '') ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleCommentReaction(comment.id, 'like')}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {comment.reactions.like.length}
                    </Button>
                    <Button
                      variant={comment.reactions.love.includes(user?.id || '') ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleCommentReaction(comment.id, 'love')}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {comment.reactions.love.length}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForoPost;
