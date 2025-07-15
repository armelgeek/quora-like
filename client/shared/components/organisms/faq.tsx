"use client";

import { Card, CardContent } from "@/shared/components/atoms/ui/card";
import { Input } from "@/shared/components/atoms/ui/input";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Button } from "@/shared/components/atoms/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/shared/components/atoms/ui/accordion";
import {
  Search,
  Clock,
  CreditCard,
  MapPin,
  Users,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

export interface FAQProps {
  faqs: FAQItem[];
  variant?: "accordion" | "grid" | "searchable";
  showCategories?: boolean;
}

export function FAQ({ faqs, variant = "accordion", showCategories = true }: FAQProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "réservation": return <CreditCard className="w-4 h-4" />;
      case "voyage": return <MapPin className="w-4 h-4" />;
      case "paiement": return <CreditCard className="w-4 h-4" />;
      case "compte": return <Users className="w-4 h-4" />;
      case "horaires": return <Clock className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (variant === "grid") {
    return (
      <div className="space-y-6">
        {showCategories && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Toutes les questions
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center space-x-1"
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFAQs.map(faq => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {faq.question}
                  </h3>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {faq.category}
                  </Badge>
                </div>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                {faq.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {faq.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "searchable") {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher dans la FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showCategories && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Tout
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center space-x-1"
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </Button>
            ))}
          </div>
        )}
        
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.map(faq => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{faq.question}</span>
                  <Badge variant="secondary" className="ml-2">
                    {faq.category}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <p className="text-gray-600 leading-relaxed mb-3">{faq.answer}</p>
                  {faq.tags && (
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune question trouvée pour votre recherche.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {filteredFAQs.map(faq => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
