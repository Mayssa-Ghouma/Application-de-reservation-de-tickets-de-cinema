import { Movie } from "@/types/movie";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Un Fils",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    description: "Un drame familial tunisien puissant qui explore les liens entre un père et son fils dans la Tunisie contemporaine.",
    category: "drame",
    showtime: "2025-11-15T20:00:00",
    availableSeats: 45,
    totalSeats: 120,
    price: 12
  },
  {
    id: "2",
    title: "Noce d'été",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    description: "Une comédie romantique tunisienne qui suit les préparatifs mouvementés d'un mariage d'été à Tunis.",
    category: "romantique",
    showtime: "2025-11-16T18:30:00",
    availableSeats: 30,
    totalSeats: 100,
    price: 10
  },
  {
    id: "3",
    title: "La Belle et la Meute",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    description: "Un thriller intense qui suit une jeune femme courageuse confrontée à l'injustice après une agression.",
    category: "action",
    showtime: "2025-11-17T21:00:00",
    availableSeats: 60,
    totalSeats: 150,
    price: 15
  },
  {
    id: "4",
    title: "Weldi",
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800",
    description: "Un drame poignant sur la radicalisation d'un jeune tunisien et la lutte de sa mère pour le sauver.",
    category: "drame",
    showtime: "2025-11-18T19:30:00",
    availableSeats: 25,
    totalSeats: 80,
    price: 12
  }
];
