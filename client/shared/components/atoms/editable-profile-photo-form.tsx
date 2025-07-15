"use client";

import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

interface EditableProfilePhotoFormProps {
  photoUrl?: string;
  disabled?: boolean;
  className?: string;
}

export function EditableProfilePhotoForm({ 
  photoUrl, 
  disabled = false,
  className 
}: EditableProfilePhotoFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);
  const { updateAvatar } = useUpdateProfile();

  const handleRemovePhoto = async () => {
    try {
      const success = await updateAvatar('');
      if (success) {
        setCurrentPhotoUrl(undefined);
        toast.success('Photo de profil supprimée');
      } else {
        toast.error('Erreur lors de la suppression de la photo');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la photo');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simuler un upload - vous devrez implémenter votre logique d'upload ici
    try {
      // Créer une URL temporaire pour l'aperçu
      const tempUrl = URL.createObjectURL(file);
      
      // Ici vous devriez envoyer le fichier à votre API d'upload
      // Pour l'instant, on simule juste avec l'URL temporaire
      const success = await updateAvatar(tempUrl);
      
      if (success) {
        setCurrentPhotoUrl(tempUrl);
        toast.success('Photo de profil mise à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour de la photo de profil');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const userInitials = 'U'; // Vous pouvez passer le nom d'utilisateur en prop si nécessaire

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Avatar avec overlay au hover */}
      <div className="relative group">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl ring-2 ring-primary/10">
            <AvatarImage 
              src={currentPhotoUrl} 
              alt="Photo de profil"
              className="object-cover transition-all duration-300 group-hover:brightness-75"
            />
            <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          {/* Overlay avec icône camera au hover */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
          
          {/* Badge de statut upload */}
          {isUploading && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'action avec design amélioré */}
      {!disabled && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Bouton d'upload avec style amélioré */}
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button
              variant="default"
              size="default"
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Changer la photo</span>
                </>
              )}
            </Button>
          </div>

          {/* Bouton de suppression avec style amélioré */}
          {currentPhotoUrl && (
            <Button
              variant="outline"
              size="default"
              onClick={handleRemovePhoto}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Supprimer
            </Button>
          )}
        </div>
      )}

      {/* Message informatif avec style amélioré */}
      <div className="text-center space-y-2">
        {disabled ? (
          <p className="text-sm text-muted-foreground">
            Modification de la photo désactivée pour les comptes anonymes
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Formats acceptés : JPEG, PNG, WebP
            </p>
            <p className="text-xs text-muted-foreground">
              Taille maximum : 5MB • Résolution recommandée : 400x400px
            </p>
          </div>
        )}
      </div>
    </div>
  );
}