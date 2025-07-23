
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quora-Like',
  description: 'Plateforme d&apos;administration ultra-simplifié pour gérer vos contenus, utilisateurs et paramètres avec des interfaces générées automatiquement.',
};

export default function Home() {
  const features = [
    {
      icon: "🤔",
      title: "Posez vos questions",
      description: "Obtenez des réponses d'experts et de passionnés sur tous les sujets qui vous intéressent."
    },
    {
      icon: "💡",
      title: "Partagez votre expertise",
      description: "Aidez les autres en partageant vos connaissances et votre expérience unique."
    },
    {
      icon: "🌍",
      title: "Communauté mondiale",
      description: "Connectez-vous avec des millions de personnes aux perspectives différentes."
    },
    {
      icon: "📚",
      title: "Apprenez en continu",
      description: "Découvrez de nouveaux sujets et élargissez vos horizons chaque jour."
    }
  ];

  const topics = [
    { name: "Technologie", color: "bg-blue-500", questions: "12.5k" },
    { name: "Science", color: "bg-green-500", questions: "8.3k" },
    { name: "Business", color: "bg-purple-500", questions: "9.7k" },
    { name: "Arts & Culture", color: "bg-pink-500", questions: "6.2k" },
    { name: "Santé", color: "bg-red-500", questions: "7.8k" },
    { name: "Éducation", color: "bg-indigo-500", questions: "5.4k" }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Développeuse Full-Stack",
      avatar: "MD",
      content: "Cette plateforme m'a permis de résoudre des problèmes complexes grâce à la communauté. Les réponses sont toujours de qualité !"
    },
    {
      name: "Thomas Martin",
      role: "Professeur de Physique",
      avatar: "TM",
      content: "Un excellent moyen de partager mes connaissances et d'apprendre de mes pairs. L'interface est intuitive et agréable."
    },
    {
      name: "Sophie Chen",
      role: "Designer UX/UI",
      avatar: "SC",
      content: "J'adore la diversité des sujets et la qualité des discussions. C'est devenu ma source principale d'inspiration créative."
    }
  ];
  return (
    <>
      <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#310ba2] via-[#23272f] to-[#3a4256]">

        <div className="relative z-10 flex w-full max-w-7xl px-6 md:px-14 py-24 items-center justify-between">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 tracking-tight leading-tight">
              Partagez et faites grandir la connaissance du monde !
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-normal leading-relaxed">
              Nous voulons connecter les personnes qui ont du savoir à celles qui en ont besoin, rassembler des gens aux perspectives différentes pour mieux se comprendre, et permettre à chacun de partager ses connaissances.
            </p>
          </div>
          <div className="flex flex-col items-end w-full max-w-xs">
            <a
              href="/register"
              className="inline-block px-10 py-5 rounded-xl bg-white text-[#310ba2] font-bold text-lg shadow border-2 border-white hover:bg-gray-50 transition-colors duration-150"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#282829] mb-3 tracking-tight">Comment ça marche ?</h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Découvrez en 3 étapes comment profiter pleinement de la plateforme.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-[#f5f6fa] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="text-4xl mb-4 text-[#310ba2]">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Posez une question</h3>
              <p className="text-gray-600 text-base font-normal">Publiez votre question sur le sujet de votre choix et touchez une large communauté.</p>
            </div>
            <div className="bg-[#f5f6fa] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="text-4xl mb-4 text-[#310ba2]">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Recevez des réponses</h3>
              <p className="text-gray-600 text-base font-normal">Des experts et passionnés vous répondent rapidement et partagent leur expérience.</p>
            </div>
            <div className="bg-[#f5f6fa] rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="text-4xl mb-4 text-[#310ba2]">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Partagez à votre tour</h3>
              <p className="text-gray-600 text-base font-normal">Aidez la communauté en répondant aux questions et en partageant vos connaissances.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#282829] mb-3 tracking-tight">
              Pourquoi choisir notre plateforme ?
            </h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Découvrez comment nous facilitons le partage de connaissances et créons des connexions significatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center text-center">
                <div className="text-4xl mb-4 text-[#310ba2]">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base font-normal">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-24 bg-[#f5f6fa]">
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#282829] mb-3 tracking-tight">
              Explorez les sujets populaires
            </h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 font-normal">
              Des milliers de questions sur tous les domaines qui vous passionnent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#310ba2] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow group-hover:scale-110 transition-transform">
                    {topic.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#282829] mb-1 tracking-tight">{topic.name}</h3>
                    <p className="text-gray-500 text-sm">{topic.questions} questions</p>
                  </div>
                </div>
                <div className="text-gray-600 text-base font-normal">
                  Découvrez les discussions les plus engageantes sur {topic.name.toLowerCase()}.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mt-10">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-[#310ba2] tracking-tight">250k+</div>
              <div className="text-gray-500 text-base font-medium">Questions posées</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-[#310ba2] tracking-tight">150k+</div>
              <div className="text-gray-500 text-base font-medium">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-[#310ba2] tracking-tight">500k+</div>
              <div className="text-gray-500 text-base font-medium">Réponses données</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-[#310ba2] tracking-tight">1M+</div>
              <div className="text-gray-500 text-base font-medium">Interactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-gradient-to-br from-[#f5f6fa] via-[#e9eafd] to-[#f5f6fa] border-b border-gray-100 relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" className="opacity-10" style={{position:'absolute',top:0,left:0}}>
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#310ba2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-14 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#282829] mb-3 tracking-tight">Ils nous font confiance</h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-6 rounded-full" />
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto font-normal mb-2">Des entreprises innovantes et institutions reconnues nous accompagnent pour accélérer le partage de connaissances.</p>
            <span className="block text-xs md:text-sm text-[#310ba2] font-semibold mt-2">+ de 100 partenaires dans le monde</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap justify-center items-center gap-6 md:gap-12 px-2 md:px-0">
              {/* NovaTech */}
              <div
                className="w-48 h-20 bg-white/90 border border-[#e3e6f3] rounded-2xl shadow-md flex flex-col items-center justify-center px-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-[#310ba2]/20 group animate-fadein"
                aria-label="Partenaire NovaTech"
                style={{minWidth:'12rem'}}
              >
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="mb-2 group-hover:filter-none filter grayscale transition-all duration-300">
                  <circle cx="20" cy="20" r="18" fill="#310ba2"/>
                  <path d="M12 28L20 12L28 28" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[#310ba2] font-bold text-base mt-1">NovaTech</span>
              </div>
              {/* DataPulse */}
              <div
                className="w-48 h-20 bg-white/90 border border-[#e3e6f3] rounded-2xl shadow-md flex flex-col items-center justify-center px-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-[#310ba2]/20 group animate-fadein"
                aria-label="Partenaire DataPulse"
                style={{minWidth:'12rem'}}
              >
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="mb-2 group-hover:filter-none filter grayscale transition-all duration-300">
                  <rect x="6" y="16" width="6" height="16" rx="2" fill="#310ba2"/>
                  <rect x="16" y="8" width="6" height="24" rx="2" fill="#310ba2"/>
                  <rect x="26" y="20" width="6" height="12" rx="2" fill="#310ba2"/>
                </svg>
                <span className="text-[#310ba2] font-bold text-base mt-1">DataPulse</span>
              </div>
              {/* EduSphere */}
              <div
                className="w-48 h-20 bg-white/90 border border-[#e3e6f3] rounded-2xl shadow-md flex flex-col items-center justify-center px-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-[#310ba2]/20 group animate-fadein"
                aria-label="Partenaire EduSphere"
                style={{minWidth:'12rem'}}
              >
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="mb-2 group-hover:filter-none filter grayscale transition-all duration-300">
                  <ellipse cx="20" cy="20" rx="16" ry="10" fill="#310ba2"/>
                  <ellipse cx="20" cy="20" rx="8" ry="5" fill="#fff" fillOpacity="0.7"/>
                </svg>
                <span className="text-[#310ba2] font-bold text-base mt-1">EduSphere</span>
              </div>
              {/* Medialogic */}
              <div
                className="w-48 h-20 bg-white/90 border border-[#e3e6f3] rounded-2xl shadow-md flex flex-col items-center justify-center px-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-[#310ba2]/20 group animate-fadein"
                aria-label="Partenaire Medialogic"
                style={{minWidth:'12rem'}}
              >
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="mb-2 group-hover:filter-none filter grayscale transition-all duration-300">
                  <rect x="8" y="8" width="24" height="24" rx="6" fill="#310ba2"/>
                  <circle cx="20" cy="20" r="7" fill="#fff" fillOpacity="0.7"/>
                </svg>
                <span className="text-[#310ba2] font-bold text-base mt-1">Medialogic</span>
              </div>
              {/* SynapseX */}
              <div
                className="w-48 h-20 bg-white/90 border border-[#e3e6f3] rounded-2xl shadow-md flex flex-col items-center justify-center px-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-[#310ba2]/20 group animate-fadein"
                aria-label="Partenaire SynapseX"
                style={{minWidth:'12rem'}}
              >
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="mb-2 group-hover:filter-none filter grayscale transition-all duration-300">
                  <path d="M10 30C20 10 30 30 20 20" stroke="#310ba2" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="5" fill="#310ba2"/>
                </svg>
                <span className="text-[#310ba2] font-bold text-base mt-1">SynapseX</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#282829] mb-3 tracking-tight">
              Ce que disent nos utilisateurs
            </h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 font-normal">
              Découvrez comment notre communauté transforme l&apos;apprentissage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#310ba2] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[#282829]">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm font-normal">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic text-base font-normal">
                  {`"${testimonial.content}"`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-14">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#282829] mb-3 tracking-tight">Questions fréquentes</h2>
            <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 font-normal">
              Retrouvez ici les réponses aux questions les plus courantes sur la plateforme.
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-[#310ba2] text-lg mb-2">Est-ce que la plateforme est gratuite ?</h3>
              <p className="text-gray-600">Oui, l&apos;inscription et l&apos;utilisation de la plateforme sont entièrement gratuites pour tous les utilisateurs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#310ba2] text-lg mb-2">Qui peut répondre aux questions ?</h3>
              <p className="text-gray-600">Tout membre inscrit peut répondre aux questions, partager son expertise et aider la communauté.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#310ba2] text-lg mb-2">Comment puis-je trouver des sujets qui m&apos;intéressent ?</h3>
              <p className="text-gray-600">Utilisez la barre de recherche ou explorez les sujets populaires pour trouver des discussions pertinentes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#310ba2] text-lg mb-2">Mes données sont-elles sécurisées ?</h3>
              <p className="text-gray-600">Nous mettons tout en œuvre pour garantir la sécurité et la confidentialité de vos données personnelles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#f5f6fa]">
        <div className="max-w-4xl mx-auto px-6 md:px-14 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-[#282829] tracking-tight">
            Prêt à rejoindre la communauté ?
          </h2>
          <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-normal">
            {"Commencez dès aujourd'hui à poser vos questions, partager vos connaissances et découvrir de nouveaux horizons."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <a
              href="/register"
              className="inline-block px-10 py-5 rounded-xl bg-[#310ba2] text-white font-bold text-lg shadow-sm hover:bg-[#232272] transition-all duration-300 transform hover:scale-105"
            >
              Créer mon compte gratuit
            </a>
            <Link
              href="/questions"
              className="inline-block px-10 py-5 rounded-xl bg-white text-[#310ba2] font-bold text-lg border border-[#310ba2] hover:bg-gray-50 transition-all duration-300"
            >
              Explorer les questions
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 md:px-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#282829] mb-3 tracking-tight">Restez informé</h2>
          <div className="w-16 h-1 bg-[#310ba2] mx-auto mb-8 rounded-full" />
          <p className="text-lg text-gray-600 mb-8 font-normal">Recevez les dernières actualités, conseils et tendances directement dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              required
              placeholder="Votre email"
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-gray-200 focus:border-[#310ba2] focus:ring-2 focus:ring-[#310ba2]/20 outline-none text-base text-gray-700 bg-[#f5f6fa]"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-[#310ba2] text-white font-bold text-base shadow-sm hover:bg-[#232272] transition-all duration-300"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
