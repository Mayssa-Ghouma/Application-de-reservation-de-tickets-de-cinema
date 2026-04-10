import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // CORRECTION : movieService.getMovies() retourne déjà un tableau
      const moviesData = await movieService.getMovies();
      
      // CORRECTION : S'assurer que movies est toujours un tableau
      setMovies(moviesData || []);
      
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Erreur lors du chargement des films');
      setMovies([]); // CORRECTION : Garantir que movies est un tableau même en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // CORRECTION : Afficher le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Chargement des films...</div>
      </div>
    );
  }

  // CORRECTION : Afficher l'erreur
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={loadMovies}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // CORRECTION : Vérification robuste avant le .map()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Films à l'affiche</h1>
      
      {/* CORRECTION : Vérification explicite que movies est un tableau */}
      {!movies || !Array.isArray(movies) || movies.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucun film disponible pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;