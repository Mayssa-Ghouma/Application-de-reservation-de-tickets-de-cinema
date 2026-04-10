import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowLeft, MapPin } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies } = useMovies();
  
  // Convertir l'ID string en number pour la comparaison
  const movieId = id ? parseInt(id) : null;
  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Film non trouvé</h2>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors: { [key: string]: string } = {
    romantique: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    comédie: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    action: 'bg-red-500/20 text-red-300 border-red-500/50',
    drame: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    horreur: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  };

  // Formater la date et l'heure
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Retourner la string originale en cas d'erreur
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Poster */}
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-glow">
            <img
              src={movie.posterUrl || '/placeholder.svg'}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Badge className={`w-fit mb-4 ${categoryColors[movie.genre] || 'bg-gray-500/20 text-gray-300 border-gray-500/50'}`}>
              {movie.genre}
            </Badge>
            
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {movie.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div>{formatDate(movie.releaseDate)}</div>
                  <div className="text-sm text-muted-foreground">à {movie.showTime}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span>{movie.availableSeats} places disponibles sur {movie.totalSeats}</span>
              </div>

              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Complexe culturel Mohamed JAMOUSSI</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-card rounded-lg border border-border mb-6">
              <div>
                <p className="text-muted-foreground mb-1">Prix du ticket</p>
                <p className="text-3xl font-bold text-primary">{movie.price} TND</p>
              </div>
              
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/booking/${movie.id}`)}
                disabled={movie.availableSeats === 0}
              >
                {movie.availableSeats === 0 ? 'Complet' : 'Réserver maintenant'}
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Informations importantes :</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Présentez votre billet QR code à l'entrée</li>
                <li>• Arrivez 15 minutes avant la séance</li>
                <li>• Les places sont numérotées</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;