
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quora-Like',
  description: 'Plateforme d&apos;administration ultra-simplifié pour gérer vos contenus, utilisateurs et paramètres avec des interfaces générées automatiquement.',
};

export default function Home() {
  return (
  <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#310ba2] via-[#23272f] to-[#3a4256]">

      <div className="relative z-10 flex w-full max-w-7xl px-14 py-20 items-center justify-between">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
            Partagez et faites grandir la connaissance du monde !
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow">
            Nous voulons connecter les personnes qui ont du savoir à celles qui en ont besoin, rassembler des gens aux perspectives différentes pour mieux se comprendre, et permettre à chacun de partager ses connaissances.
          </p>
        </div>
        <div className="flex flex-col items-end w-full max-w-xs">
          <a
            href="/register"
            className="inline-block px-8 py-4 rounded-lg bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary-dark transition-colors duration-150"
          >
            Créer un compte
          </a>
        </div>
      </div>
    </section>
  );
}
