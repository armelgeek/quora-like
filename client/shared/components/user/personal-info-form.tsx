"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/ui/card";
import { Button } from "@/shared/components/atoms/ui/button";
import { Input } from "@/shared/components/atoms/ui/input";
import { Label } from "@/shared/components/atoms/ui/label";
import { Separator } from "@/shared/components/atoms/ui/separator";
import { User, Mail, Phone, MapPin, Edit, Save } from "lucide-react";

export interface PersonalInfoFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: brancher sur l'API
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Informations personnelles</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>Téléphone</span>
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Adresse</span>
          </h4>
          <div className="space-y-2">
            <Label htmlFor="street">Adresse</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={e => setFormData(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}