import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Home, Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Booking, Movie } from '@/types/movie';

const Ticket = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  
  const bookingData: Booking = location.state?.booking;
  const movieData: Movie = location.state?.movie;

  useEffect(() => {
    if (!bookingData || !movieData) {
      toast.error('Données de réservation non trouvées');
      navigate('/');
      return;
    }

    // Générer le QR code
    const generateQRCode = async () => {
      if (canvasRef.current && bookingData.qrCode) {
        try {
          // ⭐⭐⭐ CORRECTION : Utiliser DIRECTEMENT le QR code UUID du backend ⭐⭐⭐
          const qrData = bookingData.qrCode; // "TICKET-UUID-123456"
          
          console.log('🎫 Génération QR code avec:', qrData);

          await QRCode.toCanvas(
            canvasRef.current,
            qrData,
            {
              width: 200,
              margin: 1,
              color: {
                dark: '#DC2626', // Rouge
                light: '#FFFFFF'
              }
            }
          );
          setQrGenerated(true);
          console.log('✅ QR code généré avec succès');
        } catch (error) {
          console.error('❌ Erreur génération QR code:', error);
          toast.error('Erreur lors de la génération du QR code');
        }
      } else {
        console.warn('⚠️ QR code non disponible dans les données');
      }
    };

    generateQRCode();
  }, [bookingData, movieData, navigate]);

  if (!bookingData || !movieData) {
    return null;
  }

  const handleDownload = () => {
    if (canvasRef.current && qrGenerated) {
      try {
        const url = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ticket-${movieData.title}-${bookingData.seatNumber}.png`;
        link.href = url;
        link.click();
        toast.success('Ticket téléchargé !');
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      }
    }
  };

  // Formater la date
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
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="absolute inset-0 animate-ping opacity-25">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Réservation Confirmée !
          </h1>
          <p className="text-muted-foreground text-lg">
            Votre place est réservée avec succès
          </p>
        </div>

        {/* Carte du ticket */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-primary text-white text-center pb-4">
            <CardTitle className="text-2xl font-bold truncate">
              {movieData.title}
            </CardTitle>
            <p className="text-white/80 text-sm">CinéTunisia </p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-semibold">{bookingData.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm break-all">{bookingData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-semibold">{bookingData.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{formatDate(movieData.releaseDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-semibold">{movieData.showTime}</p>
                  </div>
                </div>

                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Place N°</p>
                  <p className="text-2xl font-bold text-primary">{bookingData.seatNumber}</p>
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Montant payé</p>
              <p className="text-3xl font-bold text-primary">{bookingData.totalPrice || movieData.price} TND</p>
            </div>

            {/* QR Code */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Présentez ce QR code à l'entrée du cinéma
              </p>
              
              {/* ⭐⭐⭐ AJOUT : Affichage de l'UUID pour debug ⭐⭐⭐ */}
              {bookingData.qrCode && (
                <div className="text-center mb-2">
                  <p className="text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">
                    ID: {bookingData.qrCode}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-primary rounded-lg bg-white"
                />
              </div>
              
              {!qrGenerated && (
                <p className="text-center text-yellow-600 text-sm mt-2">
                  Génération du QR code en cours...
                </p>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
                disabled={!qrGenerated}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger le ticket
              </Button>
              
              <Button
                className="flex-1 bg-gradient-primary hover:opacity-90"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg">
          <h3 className="font-semibold mb-2 text-center">Informations importantes</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-center">
            <li>• Arrivez 15 minutes avant le début de la séance</li>
            <li>• Présentez votre QR code à l'entrée</li>
            <li>• Conservez ce ticket jusqu'à la fin de la séance</li>
            <li>• Un email de confirmation a été envoyé à <strong>{bookingData.email}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ticket;