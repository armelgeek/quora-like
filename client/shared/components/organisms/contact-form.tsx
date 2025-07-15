"use client";

import { LabeledSection } from "../../../app/(ui)/ui/components/ui-section";
import { Button } from "@/shared/components/atoms/ui/button";
import { Input } from "@/shared/components/atoms/ui/input";
import { Label } from "@/shared/components/atoms/ui/label";
import { Textarea } from "@/shared/components/atoms/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  User, 
  Send,
  CheckCircle 
} from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
  variant?: "simple" | "detailed";
  onSubmit?: (data: ContactData) => void;
}

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
}

export function ContactForm({ variant = "detailed", onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: "reservation", label: "Réservation" },
    { value: "information", label: "Information" },
    { value: "reclamation", label: "Réclamation" },
    { value: "partenariat", label: "Partenariat" },
    { value: "autre", label: "Autre" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Message envoyé !</h3>
            <p className="text-gray-600">
              Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              size="sm"
            >
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "simple") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Nous contacter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-simple">Nom complet</Label>
              <Input
                id="name-simple"
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-simple">Email</Label>
              <Input
                id="email-simple"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject-simple">Sujet</Label>
              <Input
                id="subject-simple"
                type="text"
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-simple">Message</Label>
              <Textarea
                id="message-simple"
                placeholder="Votre message..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Envoyer le message
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Envoyez-nous un message</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Nom complet</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Téléphone (optionnel)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Décrivez votre demande en détail..."
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="w-5 h-5 mr-2" />
              Envoyer le message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Téléphone</h4>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
                <p className="text-sm text-gray-500">Du lundi au vendredi, 8h-20h</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Email</h4>
                <p className="text-gray-600">contact@Boiler-transport.com</p>
                <p className="text-sm text-gray-500">Réponse sous 24h</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Adresse</h4>
                <p className="text-gray-600">123 Avenue des Transports</p>
                <p className="text-gray-600">75001 Paris, France</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Horaires</h4>
                <p className="text-gray-600">Lun-Ven : 8h00 - 20h00</p>
                <p className="text-gray-600">Sam-Dim : 9h00 - 18h00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Besoin d&apos;aide immédiate ?</h3>
              <p className="text-gray-600">
                Notre service client est disponible 24h/24 pour toute urgence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat en ligne
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ContactFormSample() {
  return (
    <div className="space-y-8">
      <LabeledSection label="Formulaire de Contact Complet">
        <ContactForm 
          variant="detailed"
          onSubmit={(data) => console.log("Contact form data:", data)}
        />
      </LabeledSection>

      <LabeledSection label="Formulaire de Contact Simple">
        <div className="max-w-md mx-auto">
          <ContactForm 
            variant="simple"
            onSubmit={(data) => console.log("Contact form data:", data)}
          />
        </div>
      </LabeledSection>
    </div>
  );
}

export { default as Contact } from '@/shared/components/molecules/contact-us';
