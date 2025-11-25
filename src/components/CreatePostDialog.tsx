import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { ForumService, ForumCategory } from "@/lib/forum";
import { User } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CreatePostDialogProps {
  user: User;
  categories: ForumCategory[];
}

export const CreatePostDialog = ({ user, categories }: CreatePostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const post = ForumService.createPost(title, content, categoryId, user);
    toast.success("Post creado exitosamente");
    
    setTitle("");
    setContent("");
    setCategoryId("");
    setOpen(false);
    
    navigate(`/foro/post/${post.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow hover:shadow-gold-glow transition-all">
          <MessageSquare className="w-4 h-4 mr-2" />
          Nuevo Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Tema</DialogTitle>
          <DialogDescription>
            Comparte tus ideas, preguntas o discusiones con la comunidad
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Escribe un título descriptivo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                placeholder="Describe tu tema en detalle..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">
                {content.length}/5000 caracteres
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Tema</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
