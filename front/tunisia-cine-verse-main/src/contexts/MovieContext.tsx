import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Movie } from "@/types/movie";
import axios from "axios";

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Omit<Movie, "id">) => Promise<void>;
  updateMovie: (id: number, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8081/api/movies";

  // Charger les films au démarrage
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>(API_URL);
        setMovies(response.data);
      } catch (err: any) {
        setError("Erreur lors du chargement des films.");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Ajouter un film
  const addMovie = async (movie: Omit<Movie, "id">) => {
    try {
      const response = await axios.post<Movie>(API_URL, movie);
      setMovies((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Erreur lors de l'ajout du film.");
      throw err; // Important pour gérer les erreurs dans le composant
    }
  };

  // Mettre à jour un film
  const updateMovie = async (id: number, updatedMovie: Partial<Movie>) => {
    try {
      const response = await axios.put<Movie>(`${API_URL}/${id}`, updatedMovie);
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? response.data : m))
      );
    } catch (err) {
      setError("Erreur lors de la mise à jour du film.");
      throw err;
    }
  };

  // Supprimer un film
  const deleteMovie = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du film.");
      throw err;
    }
  };

  return (
    <MovieContext.Provider
      value={{ movies, addMovie, updateMovie, deleteMovie, loading, error }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};