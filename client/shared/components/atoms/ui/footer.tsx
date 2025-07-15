"use client";

import { Logo } from "@/shared/components/atoms/ui/logo";
import { Button } from "@/shared/components/atoms/ui/button";
import { Separator } from "@/shared/components/atoms/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Award
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  variant?: "simple" | "detailed" | "minimal";
  showNewsletter?: boolean;
  showSocial?: boolean;
  showStats?: boolean;
}

export function Footer({
  variant = "detailed",
  showSocial = true,
}: FooterProps) {
  const footerSections: FooterSection[] = [
    {
      title: "Services",
      links: [
        { label: "Réservation en ligne", href: "/reservation" },
        { label: "Nos destinations", href: "/destinations" },
        { label: "Horaires", href: "/horaires" },
        { label: "Tarifs", href: "/tarifs" },
        { label: "Groupes", href: "/groupes" }
      ]
    },
    {
      title: "Aide",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
        { label: "Service client", href: "/support" },
        { label: "Réclamations", href: "/reclamations" },
        { label: "Objets trouvés", href: "/objets-trouves" }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/about" },
        { label: "Carrières", href: "/careers" },
        { label: "Presse", href: "/press" },
        { label: "Partenaires", href: "/partners" },
        { label: "Investisseurs", href: "/investors" }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions générales", href: "/terms" },
        { label: "Politique de confidentialité", href: "/privacy" },
        { label: "Cookies", href: "/cookies" },
        { label: "Mentions légales", href: "/legal" },
        { label: "RGPD", href: "/gdpr" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/Boiler-transport", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/Boiler-transport", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/Boiler-transport", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/Boiler-transport", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@Boiler-transport", label: "YouTube" }
  ];


  if (variant === "minimal") {
    return (
      <>

      </>
    );
  }

  if (variant === "simple") {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo theme="light" size="lg" className="mb-4" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre partenaire de confiance pour tous vos déplacements en France.
                Confort, ponctualité et sécurité garantis.
              </p>
            </div>

            {footerSections.slice(0, 3).map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.slice(0, 4).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Boiler Transport. Tous droits réservés.
            </div>

            {showSocial && (
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <social.icon className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Logo theme="light" size="lg" className="mb-4" />
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Depuis notre création, nous vous accompagnons dans tous vos déplacements
                avec un service de qualité et des tarifs compétitifs.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">contact@Boiler-transport.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">123 Avenue des Transports, 75001 Paris</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">Service client 24h/24 - 7j/7</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-sm text-gray-400">
                © 2024 Boiler Transport. Tous droits réservés.
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Paiement sécurisé</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Certifié ISO 9001</span>
                </div>
              </div>
            </div>

            {showSocial && (
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <social.icon className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
