import { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const feedbackSchema = z.object({
  comment: z.string()
    .trim()
    .min(10, { message: "El comentario debe tener al menos 10 caracteres" })
    .max(500, { message: "El comentario no puede exceder 500 caracteres" }),
  rating: z.number().min(1).max(5).optional(),
});

export const BetaBadge = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const result = feedbackSchema.safeParse({ comment, rating: rating || undefined });
    
    if (!result.success) {
      toast({
        title: "Error de validación",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrate with Supabase
    // await supabase.from('feedback').insert({
    //   comment: result.data.comment,
    //   rating: result.data.rating,
    //   user_id: user?.id,
    //   created_at: new Date().toISOString(),
    // });

    // Mock delay
    setTimeout(() => {
      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu opinión nos ayuda a mejorar Auphere cada día.",
      });
      
      setComment("");
      setRating(0);
      setIsSubmitting(false);
      setShowForm(false);
    }, 800);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Beta
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Estamos en fase Beta
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Esta aplicación está construida para ti. Tus comentarios y recomendaciones 
                nos ayudarán a mejorarla cada día.
              </p>
            </div>
          </div>

          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
              variant="default"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar comentario
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-border">
              {/* Rating stars */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  ¿Cómo calificarías tu experiencia? (Opcional)
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment textarea */}
              <div className="space-y-2">
                <Label htmlFor="feedback-comment" className="text-xs font-medium">
                  Tu comentario
                </Label>
                <Textarea
                  id="feedback-comment"
                  placeholder="Cuéntanos qué te gusta, qué mejorarías, o cualquier sugerencia que tengas..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] resize-none text-sm"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {comment.length}/500
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setComment("");
                    setRating(0);
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || comment.trim().length < 10}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
