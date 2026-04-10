import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const categoryColors: { [key: string]: string } = {
    romantique: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    comédie: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    action: 'bg-red-500/20 text-red-300 border-red-500/50',
    drame: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    horreur: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-glow transition-all duration-300 border-border/50 hover:border-primary/50">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posterUrl || '/placeholder.svg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Badge className={`absolute top-3 right-3 ${categoryColors[movie.genre] || 'bg-gray-500/20 text-gray-300 border-gray-500/50'}`}>
          {movie.genre}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 text-foreground line-clamp-1">{movie.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {movie.description}
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(movie.releaseDate)} à {movie.showTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{movie.availableSeats} / {movie.totalSeats} places</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">{movie.price} TND</div>
        <Link to={`/movie/${movie.id}`}>
          <Button 
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={movie.availableSeats === 0}
          >
            {movie.availableSeats === 0 ? 'Complet' : 'Réserver'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;