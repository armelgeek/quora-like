"use client";
import { Card, CardContent } from "@/shared/components/atoms/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/ui/avatar";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Button } from "@/shared/components/atoms/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TestimonialProps {
  id: string;
  name: string;
  role?: string;
  location?: string;
  avatar?: string;
  rating: number;
  comment: string;
  date?: string;
  route?: string;
  verified?: boolean;
}

interface TestimonialsProps {
  testimonials: TestimonialProps[];
  variant?: "grid" | "carousel" | "simple";
  showRating?: boolean;
  showRoute?: boolean;
}

function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          aria-label={i < rating ? "star filled" : "star empty"}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials, variant = "grid", showRating = true, showRoute = false }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  if (variant === "carousel") {
    const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
    const t = testimonials[current];
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Quote className="w-8 h-8 text-primary mb-2" />
            <p className="text-lg text-center italic">{t.comment}</p>
            <div className="flex items-center gap-4 mt-4">
              <Avatar>
                {t.avatar ? <AvatarImage src={t.avatar} alt={t.name} /> : <AvatarFallback>{t.name[0]}</AvatarFallback>}
              </Avatar>
              <div>
                <div className="font-semibold">{t.name}</div>
                {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                {showRoute && t.route && <Badge>{t.route}</Badge>}
              </div>
            </div>
            {showRating && <StarRating rating={t.rating} />}
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="icon" onClick={prev} aria-label="Précédent"><ChevronLeft /></Button>
              <Button variant="ghost" size="icon" onClick={next} aria-label="Suivant"><ChevronRight /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // grid or simple
  return (
    <div className={`grid ${variant === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "grid-cols-1 gap-4"}`}>
      {testimonials.map((t) => (
        <Card key={t.id}>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <Quote className="w-6 h-6 text-primary mb-2" />
            <p className="text-base text-center italic">{t.comment}</p>
            <div className="flex items-center gap-4 mt-2">
              <Avatar>
                {t.avatar ? <AvatarImage src={t.avatar} alt={t.name} /> : <AvatarFallback>{t.name[0]}</AvatarFallback>}
              </Avatar>
              <div>
                <div className="font-semibold">{t.name}</div>
                {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                {showRoute && t.route && <Badge>{t.route}</Badge>}
              </div>
            </div>
            {showRating && <StarRating rating={t.rating} />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
