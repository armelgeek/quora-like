import Image from 'next/image';
import { AnswerForm, AnswersList } from '@/features/answer/components/answer-form';
import PollVoteWidget from '@/features/poll/components/poll-vote-widget';
import { useState } from 'react';

interface QuestionCardProps {
    q: any;
    idx: number;
    sort: string;
    session: any | null;
    upvoteQuestion: {
        mutate: (id: string) => void;
        isPending: boolean;
    };
    downvoteQuestion: {
        mutate: (id: string) => void;
        isPending: boolean;
    };
}

export default function QuestionCard(props: QuestionCardProps) {
    const { q, idx, sort, session, upvoteQuestion, downvoteQuestion } = props;
    const [showOptions, setShowOptions] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const initials = (q.user?.name || q.user?.firstname || q.user?.email || '?')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const createdAt = new Date(q.createdAt);
    const timeAgo = getTimeAgo(createdAt);

    return (
        <div className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200">
            {/* Header avec utilisateur et métadonnées */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {q.user?.avatarUrl ? (
                            <Image
                                src={q.user.avatarUrl}
                                alt="avatar"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-cover"
                                unoptimized
                            />
                        ) : (
                            <span className="text-gray-500 text-xs font-medium">{initials}</span>
                        )}
                    </div>

                    {/* Infos utilisateur */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-900 hover:underline cursor-pointer">
                                {q.user?.name || q.user?.firstname || q.user?.email || 'Utilisateur anonyme'}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500">{timeAgo}</span>
                        </div>

                        {/* Topic/Espace */}
                        <div className="mt-1">
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                {q.topic?.name || 'Général'}
                            </span>
                        </div>
                    </div>

                    {/* Menu options */}
                    <div className="relative">
                        <button
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => setShowOptions(!showOptions)}
                            aria-label="Plus d'options"
                        >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="5" cy="12" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="19" cy="12" r="2" />
                            </svg>
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">
                                    Suivre la question
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">
                                    Ne plus voir ce contenu
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">
                                    Signaler
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="px-4 pb-3">
                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2 hover:underline cursor-pointer">
                    {q.title}
                </h2>

                {q.body && (
                    <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                        {q.body}
                    </p>
                )}

                {/* Tags */}
                {Array.isArray(q.tags) && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {q.tags.map((tag: { id: string; name: string }) => (
                            <span
                                key={tag.id}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Indicateur "Recommandé pour vous" */}
                {sort === 'recent' && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded mb-3">
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Recommandé pour vous
                    </div>
                )}
            </div>

            {q.type === 'poll' && session?.userId && (
                <div className='px-6'>
                <PollVoteWidget questionId={q.id} userId={session.userId} />
                </div>
            )}

            <div className="px-4 pb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <button
                        className={`p-1.5 rounded-full hover:bg-green-50 transition-colors ${upvoteQuestion.isPending ? 'opacity-60' : ''
                            }`}
                        onClick={() => upvoteQuestion.mutate(q.id)}
                        disabled={upvoteQuestion.isPending}
                        aria-label="Voter pour"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                            className="text-gray-600 hover:text-green-600" viewBox="0 0 24 24">
                            <path d="M7 14l5-5 5 5" />
                        </svg>
                    </button>
                    <span className="text-gray-600 font-medium min-w-[20px] text-center">
                        {typeof q.votesCount === 'number' ? q.votesCount : 0}
                    </span>
                    <button
                        className={`p-1.5 rounded-full hover:bg-red-50 transition-colors ${downvoteQuestion.isPending ? 'opacity-60' : ''
                            }`}
                        onClick={() => downvoteQuestion.mutate(q.id)}
                        disabled={downvoteQuestion.isPending}
                        aria-label="Voter contre"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                            className="text-gray-600 hover:text-red-600" viewBox="0 0 24 24">
                            <path d="M17 10l-5 5-5-5" />
                        </svg>
                    </button>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>Répondre</span>
                    {typeof q.answersCount === 'number' && q.answersCount > 0 && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                            {q.answersCount}
                        </span>
                    )}
                </button>

                <button
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isFollowing
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {isFollowing ? (
                            <path d="M20 6L9 17l-5-5" />
                        ) : (
                            <path d="M12 5v14M5 12h14" />
                        )}
                    </svg>
                    <span>{isFollowing ? 'Suivi' : 'Suivre'}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16,6 12,2 8,6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span>Partager</span>
                </button>
            </div>

            <div className="border-t border-gray-100">
                <AnswersList questionId={q.id} />
                <div className="px-4 py-3 bg-gray-50/50">
                    <AnswerForm questionId={q.id} />
                </div>
            </div>
        </div>
    );
}

function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}j`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}sem`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mois`;
    return `${Math.floor(diffInSeconds / 31536000)}an`;
}