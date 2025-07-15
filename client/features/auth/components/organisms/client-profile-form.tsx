"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/atoms/ui/button';
import { Input } from '@/shared/components/atoms/ui/input';
import { Label } from '@/shared/components/atoms/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { EditIcon, CheckIcon, XIcon, Loader2, User } from 'lucide-react';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { authClient } from '@/shared/lib/config/auth-client';
import { cn } from '@/shared/lib/utils';

interface EditableFieldProps {
  label: string;
  value?: string;
  onUpdate: (value: string) => Promise<boolean>;
  type?: 'text' | 'email';
  placeholder?: string;
  disabled?: boolean;
}

function EditableField({ 
  label, 
  value = '', 
  onUpdate, 
  type = 'text',
  placeholder = '---',
  disabled = false 
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (inputValue === value) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    const success = await onUpdate(inputValue);
    setIsLoading(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (!disabled) {
      setInputValue(value);
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500 font-medium tracking-wide">
        {label}
      </Label>
      <div 
        className={cn(
          "flex flex-row items-center min-h-[40px] rounded-lg border border-transparent px-2 py-1 transition-all bg-white hover:border-primary/30 focus-within:border-primary/70",
          disabled && "cursor-not-allowed opacity-60 bg-gray-50"
        )}
        tabIndex={disabled ? -1 : 0}
        onClick={handleEdit}
        aria-disabled={disabled}
      >
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-base px-2 py-1 border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/30"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              aria-label={label}
            />
            <Button
              variant="outline"
              size="icon"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={isLoading}
              aria-label="Valider"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              disabled={isLoading}
              aria-label="Annuler"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className={cn(
              "flex-1 text-base px-2 py-1 border border-gray-300 rounded-lg py-1",
              !value && "text-muted-foreground text-sm"
            )}>
              {value || placeholder}
            </span>
            {!disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 text-primary hover:bg-primary/10"
                tabIndex={-1}
                aria-label={`Modifier ${label}`}
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface ClientProfileFormProps {
  user: {
    name?: string;
    email?: string;
    image?: string | null;
    isAnonymous?: boolean | null;
  };
  onUserUpdate?: (updatedUser: {
    name?: string;
    email?: string;
    image?: string | null;
    isAnonymous?: boolean | null;
  }) => void;
}

export function ClientProfileForm({ user, onUserUpdate }: ClientProfileFormProps) {
  const { updateName, updateEmail } = useUpdateProfile();
  const [currentUser, setCurrentUser] = useState(user);

  // Met à jour l'état local quand les props changent
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleUpdateName = async (name: string) => {
    const success = await updateName(name);
    if (success) {
      // Rafraîchir les données utilisateur
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          const updatedUser = { ...currentUser, name: session.user.name };
          setCurrentUser(updatedUser);
          onUserUpdate?.(updatedUser);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
    return success;
  };

  const handleUpdateEmail = async (email: string) => {
    const success = await updateEmail(email);
    if (success) {
      // Rafraîchir les données utilisateur
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          const updatedUser = { ...currentUser, email: session.user.email };
          setCurrentUser(updatedUser);
          onUserUpdate?.(updatedUser);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
    return success;
  };

  return (
    <Card className='bg-white shadow-sm rounded-sm'>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Information personnelle</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableField
          label="Nom"
          value={currentUser.name}
          onUpdate={handleUpdateName}
          placeholder="Votre nom"
          disabled={currentUser.isAnonymous === true}
        />
        
        <EditableField
          label="Email"
          value={currentUser.email}
          onUpdate={handleUpdateEmail}
          type="email"
          placeholder="votre@email.com"
          disabled={currentUser.isAnonymous === true}
        />
      </CardContent>
    </Card>
  );
}
