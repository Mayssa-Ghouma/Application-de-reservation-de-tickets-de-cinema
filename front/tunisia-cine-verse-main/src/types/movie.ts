export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  posterUrl: string;
  releaseDate: string;      // Format: "2024-01-15"
  showTime: string;         // Format: "20:30:00"
  price: number;
  totalSeats: number;
  availableSeats: number;
  admin?: Admin;
  bookings?: Booking[];
}

export interface Admin {
  id: number;
  username: string;        // ← CORRIGÉ: "name" → "username"
  email: string;
  password?: string;
}

export interface Booking {
  id: number;
  bookingDate: string;     // Format: "2024-01-15T20:30:00"
  seatNumber: number;
  totalPrice: number;
  qrCode: string;
  fullName: string;        // ← CORRIGÉ: "customerName" → "fullName"
  email: string;           // ← CORRIGÉ: "customerEmail" → "email"
  phone: string;           // ← CORRIGÉ: "customerPhone" → "phone"
  movie: Movie;
  paiement: Paiement;      // ← CORRIGÉ: relation avec Paiement
  paymentStatus?: 'pending' | 'completed';
}

export interface Paiement {
  id: number;
  cardNumber: string;
  expirationDate: string;  // Format: "12/25"
  cvv: string;
  amount: number;
  paymentDate: string;     // Format: "2024-01-15T20:30:00"
  bookings?: Booking[];
}