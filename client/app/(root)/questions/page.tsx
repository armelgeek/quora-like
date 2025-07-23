"use client"

import { useQuestions } from '@/features/question/hooks/use-question'
import Image from 'next/image'
import { useVote } from '@/features/vote/hooks/use-vote'
import { useState } from 'react'
import { useSession } from '@/shared/hooks/use-session-info'
import QuestionCard from '@/features/question/components/question-card'
import Link from 'next/link'


export default function QuestionsFeedPage() {
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState<'recent' | 'most-answered' | 'bump' | 'most-voted' | 'no-answer' | 'populaire'>('recent')
    const { session } = useSession()
    const limit = 10
    const { data: questionsRaw, isLoading, error } = useQuestions({ skip: (page - 1) * limit, limit, sort })
    const questions = Array.isArray(questionsRaw) ? questionsRaw : []
    const { upvoteQuestion, downvoteQuestion } = useVote()

    const sideTabs = [
        { key: 'recent', label: 'Questions pour vous', sort: 'recent', icon: '⭐' },
        { key: 'populaire', label: 'Trending', sort: 'populaire', icon: undefined },
        { key: 'most-answered', label: 'Demandes de réponse', sort: 'most-answered', icon: undefined },
        { key: 'most-voted', label: 'Hot', sort: 'most-voted', icon: undefined },
        { key: 'bump', label: 'Bump', sort: 'bump', icon: undefined },
        { key: 'no-answer', label: 'Brouillons', sort: 'no-answer', icon: undefined },
    ] as const;

    const suggestions = [
        { id: 1, label: "Luna Lovegood (personnage de Harry Potter)", avatar: "/avatar1.jpg" },
        { id: 2, label: "Love (l'album des Beatles)", avatar: "/avatar2.jpg" },
    ];

    return (
        <div className="min-h-screen bg-[#f6f7f8] flex flex-row justify-center py-10 px-2 relative">
            {/* Floating Ask Question Button */}
            <button
                className="fixed z-30 bottom-8 right-8 bg-[#b92b27] hover:bg-[#a11d1a] text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all flex items-center gap-2 group"
                style={{ boxShadow: '0 4px 24px 0 rgba(185,43,39,0.15)' }}
                aria-label="Poser une question"
            >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="mr-1"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                <span className="hidden sm:inline">Poser une question</span>
            </button>

            <aside className="hidden md:flex flex-col w-56 pr-6 sticky top-24 self-start h-fit" style={{ zIndex: 10 }}>
                <ul className="space-y-0.5">
                    {sideTabs.map(tabItem => (
                        <li key={tabItem.key}>
                            <button
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${sort === tabItem.key ? 'bg-[#f1f2f2] text-[#b92b27] font-bold shadow-sm' : 'text-[#282829] hover:bg-[#f6f7f8]'}`}
                                onClick={() => { setSort(tabItem.key as typeof sort); setPage(1) }}
                                tabIndex={0}
                            >
                                <span className="flex items-center gap-2">
                                    {typeof tabItem.icon === 'string' && tabItem.icon.length > 0 && (
                                        <span className="text-base">{tabItem.icon}</span>
                                    )}
                                    {tabItem.label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 bg-white rounded-lg border border-gray-100 p-3">
                    <div className="text-[#282829] text-sm font-semibold mb-1">Découvrir</div>
                    <ul className="space-y-1.5">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#b92b27]"></span>
                            <span className="text-[#282829] text-xs">Quora Like</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#310ba2]"></span>
                            <span className="text-[#282829] text-xs">Tendances</span>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className="flex-1 max-w-2xl mx-auto">
                <Link
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 mb-8 shadow-sm cursor-pointer hover:shadow-md transition group"
                    href="/question/create"
                    tabIndex={0}
                    role="button"
                    aria-label="Créer une question"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {typeof session?.userId === 'string' && session.userId.length > 0 ? session.userId.charAt(0).toUpperCase() : 'Q'}
                    </div>
                    <span className="flex-1 text-gray-500 text-base group-hover:text-[#b92b27] transition select-none">Qu&apos;avez-vous envie de demander ou partager&nbsp;?</span>
                    <button
                        className="bg-[#b92b27] hover:bg-[#a11d1a] text-white px-4 py-2 rounded-full text-sm font-semibold shadow transition hidden sm:block"
                        tabIndex={-1}
                    >
                        Poser une question
                    </button>
                </Link>
                {isLoading && (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-200 shadow px-7 py-8 mb-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}
                {error && <div className="text-red-500">Erreur lors du chargement des questions</div>}
                <div className="space-y-8">
                    {questions.length > 0 ? (
                        questions.map((q, idx) => (
                            <QuestionCard
                                key={q.id}
                                q={q}
                                idx={idx}
                                sort={sort}
                                session={session}
                                upvoteQuestion={upvoteQuestion}
                                downvoteQuestion={downvoteQuestion}
                            />
                        ))
                    ) : (
                        !isLoading && <div className="text-gray-500">Aucune question pour le moment.</div>
                    )}
                </div>
                <div className="flex justify-between items-center mt-10">
                    <button
                        className="px-5 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Précédent
                    </button>
                    <span className="text-base text-gray-500 font-semibold">Page {page}</span>
                    <button
                        className="px-5 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={questions.length < limit}
                    >
                        Suivant
                    </button>
                </div>
            </main>

            <aside className="hidden lg:flex flex-col w-72 pl-6">
                <div className="bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#282829] text-base font-semibold">Sujets connus</span>
                        <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400" aria-label="Modifier">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {suggestions.map(s => (
                            <li key={s.id} className="flex items-center gap-2">
                                <Image
                                    src={s.avatar}
                                    alt="avatar"
                                    width={28}
                                    height={28}
                                    className="w-7 h-7 rounded-full object-cover bg-gray-200 border border-gray-100"
                                    unoptimized
                                />
                                <span className="text-[#282829] text-sm font-medium">{s.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100 mb-3 shadow-sm">
                    <div className="text-[#282829] text-sm font-semibold mb-1">Suggestions</div>
                    <ul className="space-y-1.5">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#b92b27]"></span>
                            <span className="text-[#282829] text-xs">Rejoignez la discussion</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#310ba2]"></span>
                            <span className="text-[#282829] text-xs">Explorez les sujets</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
