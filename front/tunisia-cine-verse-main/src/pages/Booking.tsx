import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies } = useMovies();
  
  const movieId = id ? parseInt(id) : null;
  const movie = movies.find(m => m.id === movieId);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    seatNumber: 1
  });
  const [loading, setLoading] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Film non trouvé</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ CORRECTION : Structure EXACTE attendue par le backend
      const bookingRequest = {
        booking: {
          seatNumber: formData.seatNumber,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          movie: { id: movie.id }
          // ❌ NE PAS inclure movie_id ici - c'est géré par la relation JPA
        },
        paiement: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expirationDate: formData.expirationDate,
          cvv: formData.cvv,
          amount: movie.price
        }
      };

      console.log('📤 Envoi au backend:', bookingRequest);

      const response = await axios.post('http://localhost:8081/api/bookings', bookingRequest);
      const booking = response.data;

      console.log('✅ Réponse du backend:', booking);
      
      toast.success('Réservation confirmée ! Votre ticket a été généré.');
      
      // Navigation vers la page ticket
      navigate(`/ticket/${booking.id}`, {
        state: {
          booking: booking,
          movie: movie
        }
      });
      
    } catch (error: any) {
      console.error('❌ Erreur de réservation:', error);
      
      // ✅ CORRECTION : Meilleure gestion d'erreurs
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.error('📋 Détails erreur 400:', errorData);
        
        if (typeof errorData === 'string') {
          if (errorData.includes('availableSeats') || errorData.includes('null')) {
            toast.error('Problème technique avec les places disponibles. Contactez l\'administrateur.');
          } else {
            toast.error(`Erreur: ${errorData}`);
          }
        } else {
          toast.error('Données invalides envoyées au serveur');
        }
      } else if (error.response?.status === 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        toast.error('Erreur lors de la réservation');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTION : Génération de siège simplifiée
  const generateRandomSeat = () => {
    const randomSeat = Math.floor(Math.random() * movie.totalSeats) + 1;
    setFormData(prev => ({ ...prev, seatNumber: randomSeat }));
  };

  // ✅ CORRECTION : Formatage amélioré
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : '';
  };

  // ✅ CORRECTION : Formatage date d'expiration
  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au film
        </Button>

        <Card className="border-border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-2xl">Réservation - {movie.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {movie.availableSeats ?? movie.totalSeats} places disponibles • 
              Séance le {new Date(movie.releaseDate).toLocaleDateString('fr-FR')} à {movie.showTime}
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informations personnelles</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Votre nom complet"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre email"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+216"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatNumber">Numéro de siège *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="seatNumber"
                      type="number"
                      min="1"
                      max={movie.totalSeats}
                      value={formData.seatNumber}
                      onChange={(e) => setFormData({ ...formData, seatNumber: parseInt(e.target.value) || 1 })}
                      required
                      disabled={loading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateRandomSeat}
                      disabled={loading}
                    >
                      Aléatoire
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choisissez un siège entre 1 et {movie.totalSeats}
                  </p>
                </div>
              </div>

              {/* Paiement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Informations de paiement
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numéro de carte *</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      cardNumber: formatCardNumber(e.target.value) 
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Date d'expiration (MM/AA) *</Label>
                    <Input
                      id="expirationDate"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        expirationDate: formatExpirationDate(e.target.value) 
                      })}
                      placeholder="12/25"
                      maxLength={5}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        cvv: e.target.value.replace(/\D/g, '') 
                      })}
                      placeholder="123"
                      maxLength={3}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Résumé et paiement */}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total à payer</span>
                  <span className="text-2xl font-bold text-primary">{movie.price} TND</span>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
                  size="lg"
                  disabled={(movie.availableSeats ?? 0) === 0 || loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    `Payer ${movie.price} TND`
                  )}
                </Button>
                
                {(movie.availableSeats ?? 0) === 0 ? (
                  <p className="text-center text-red-500 mt-2 font-semibold">
                    ❌ Complet - Plus de places disponibles
                  </p>
                ) : (
                  <p className="text-center text-green-500 mt-2">
                    ✅ {movie.availableSeats ?? movie.totalSeats} places disponibles
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;