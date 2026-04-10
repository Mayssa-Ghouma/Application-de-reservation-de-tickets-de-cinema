import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// INTERFACE Movie nettoyée (sans récursion)
export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  posterUrl: string;
  releaseDate: string;
  showTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export interface BookingRequest {
  booking: {
    seatNumber: number;
    fullName: string;
    email: string;
    phone: string;
    movie: { id: number };
  };
  paiement: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    amount: number;
  };
}

export interface BookingResponse {
  id: number;
  bookingDate: string;
  seatNumber: number;
  totalPrice: number;
  qrCode: string;
  fullName: string;
  email: string;
  phone: string;
  movie: Movie;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}

// ⭐⭐⭐ CORRECTION CRITIQUE : Nettoyage des données récursives ⭐⭐⭐
const cleanMovieData = (movieData: any): Movie => {
  return {
    id: movieData.id,
    title: movieData.title,
    description: movieData.description,
    genre: movieData.genre,
    posterUrl: movieData.posterUrl,
    releaseDate: movieData.releaseDate,
    showTime: movieData.showTime,
    price: movieData.price,
    totalSeats: movieData.totalSeats,
    availableSeats: movieData.availableSeats
  };
};

const cleanMoviesData = (moviesData: any[]): Movie[] => {
  return moviesData.map(movie => cleanMovieData(movie));
};

// SERVICE Movies avec nettoyage des données
export const movieService = {
  getMovies: async (): Promise<Movie[]> => {
    try {
      const response = await api.get('/movies');
      console.log('🎬 Films reçus (brut):', response.data);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      let cleanedMovies: Movie[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        cleanedMovies = cleanMoviesData(response.data);
      }
      
      console.log('🎬 Films nettoyés:', cleanedMovies);
      return cleanedMovies;
      
    } catch (error: any) {
      console.error('❌ Erreur chargement films:', error.response?.data || error.message);
      return [];
    }
  },

  getMovieById: async (id: number): Promise<Movie | null> => {
    try {
      const response = await api.get(`/movies/${id}`);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedMovie = cleanMovieData(response.data);
      return cleanedMovie;
      
    } catch (error: any) {
      console.error(`❌ Erreur film ${id}:`, error.response?.data || error.message);
      return null;
    }
  },

  createMovie: async (movie: Omit<Movie, 'id'>): Promise<Movie | null> => {
    try {
      const response = await api.post('/movies', movie);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedMovie = cleanMovieData(response.data);
      return cleanedMovie;
      
    } catch (error: any) {
      console.error('❌ Erreur création film:', error.response?.data || error.message);
      return null;
    }
  },

  updateMovie: async (id: number, movie: Partial<Movie>): Promise<Movie | null> => {
    try {
      const response = await api.put(`/movies/${id}`, movie);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedMovie = cleanMovieData(response.data);
      return cleanedMovie;
      
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour film ${id}:`, error.response?.data || error.message);
      return null;
    }
  },

  deleteMovie: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/movies/${id}`);
      return true;
    } catch (error: any) {
      console.error(`❌ Erreur suppression film ${id}:`, error.response?.data || error.message);
      return false;
    }
  }
};

// SERVICE Booking avec nettoyage des données
export const bookingService = {
  createBooking: async (bookingRequest: BookingRequest): Promise<BookingResponse> => {
    try {
      console.log('📤 Envoi réservation:', JSON.stringify(bookingRequest, null, 2));
      
      const response = await api.post('/bookings', bookingRequest);
      console.log('✅ Réservation créée (brut):', response.data);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedBooking: BookingResponse = {
        ...response.data,
        movie: cleanMovieData(response.data.movie)
      };
      
      console.log('✅ Réservation nettoyée:', cleanedBooking);
      return cleanedBooking;
      
    } catch (error: any) {
      console.error('❌ Erreur réservation:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status || 500
      };
      throw apiError;
    }
  },

  getBookingsByEmail: async (email: string): Promise<any[]> => {
    try {
      const response = await api.get(`/bookings/email/${email}`);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedBookings = response.data.map((booking: any) => ({
        ...booking,
        movie: cleanMovieData(booking.movie)
      }));
      
      return cleanedBookings;
    } catch (error: any) {
      console.error('❌ Erreur chargement réservations:', error.response?.data || error.message);
      return [];
    }
  },

  cancelBooking: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/bookings/${id}`);
      return true;
    } catch (error: any) {
      console.error(`❌ Erreur annulation réservation ${id}:`, error.response?.data || error.message);
      return false;
    }
  },

  validateQRCode: async (qrCode: string): Promise<BookingResponse | null> => {
    try {
      const response = await api.get(`/bookings/validate-qr/${qrCode}`);
      
      // ⭐⭐⭐ NETTOYAGE DES DONNÉES RÉCURSIVES ⭐⭐⭐
      const cleanedBooking: BookingResponse = {
        ...response.data,
        movie: cleanMovieData(response.data.movie)
      };
      
      return cleanedBooking;
    } catch (error: any) {
      console.error('❌ Erreur validation QR:', error.response?.data || error.message);
      return null;
    }
  }
};

// SERVICE Admin (inchangé)
export const adminService = {
  login: async (username: string, password: string): Promise<any> => {
    try {
      console.log('🔐 Tentative de connexion:', { username });
      
      const response = await api.post('/admins/login', { username, password });
      console.log('✅ Connexion réussie');
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error.response?.data || error.message);
      
      const apiError: ApiError = {
        message: error.response?.data?.message || error.response?.data || 'Erreur de connexion',
        status: error.response?.status || 401
      };
      throw apiError;
    }
  },

  checkHealth: async (): Promise<boolean> => {
    try {
      await api.get('/movies');
      return true;
    } catch (error) {
      console.error('🔴 Backend non accessible');
      return false;
    }
  }
};

export const checkBackendConnection = async (): Promise<boolean> => {
  return await adminService.checkHealth();
};

export default api;