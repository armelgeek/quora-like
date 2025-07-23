import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AnswerSchema, AnswerPayload } from '@/features/answer/answer.schema'
import { useCreateAnswer, useAnswers } from '@/features/answer/hooks/use-answer'
import { useSession } from '@/shared/hooks/use-session-info'
import { AnswerThread } from './answer-thread'

export function AnswerForm({ questionId }: { questionId: string }) {
  const { session } = useSession()
  const { mutate, isPending, error } = useCreateAnswer(questionId)
  const [isFocused, setIsFocused] = useState(false)
  
  const form = useForm<AnswerPayload>({
    resolver: zodResolver(AnswerSchema.pick({ body: true })),
    defaultValues: { body: '' }
  })
  
  const watchedBody = form.watch('body')
  const hasContent = watchedBody && watchedBody.trim().length > 0
  
  const onSubmit = (data: AnswerPayload) => {
    if (!session || !hasContent) return
    mutate({ ...data, userId: session.userId })
    form.reset()
    setIsFocused(false)
  }

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
        <p className="text-gray-600 text-sm mb-2">Connectez-vous pour répondre à cette question</p>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        

        {/* Zone de texte */}
        <div className={`relative border-2 rounded-lg transition-all duration-200 ${
          isFocused 
            ? 'border-blue-500 shadow-sm' 
            : error
              ? 'border-red-300'
              : 'border-gray-200 hover:border-gray-300'
        }`}>
          <textarea
            {...form.register('body')}
            className="w-full px-4 py-3 rounded-lg resize-none focus:outline-none text-gray-900 placeholder-gray-500"
            placeholder="Écrivez votre réponse..."
            rows={isFocused ? 4 : 2}
            disabled={isPending}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (!hasContent) setIsFocused(false)
            }}
          />
          
          {/* Compteur de caractères (visible si focusé) */}
          {isFocused && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {watchedBody?.length || 0} caractères
            </div>
          )}
        </div>

        {/* Actions */}
        {(isFocused || hasContent) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Boutons de formatage */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Gras"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Italique"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <line x1="19" y1="4" x2="10" y2="4"/>
                    <line x1="14" y1="20" x2="5" y2="20"/>
                    <line x1="15" y1="4" x2="9" y2="20"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Lien"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bouton Annuler */}
              <button
                type="button"
                onClick={() => {
                  form.reset()
                  setIsFocused(false)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                disabled={isPending}
              >
                Annuler
              </button>
              
              {/* Bouton Publier */}
              <button
                type="submit"
                disabled={isPending || !hasContent}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  hasContent && !isPending
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Publication...
                  </div>
                ) : (
                  'Publier'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Une erreur est survenue lors de la publication de votre réponse
          </div>
        )}
      </form>
    </div>
  )
}

export function AnswersList({ questionId }: { questionId: string }) {
  const { data, isLoading } = useAnswers(questionId)
  
  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span className="text-sm">Chargement des réponses...</span>
        </div>
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="mt-6 text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" 
               className="text-gray-400" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 className="text-gray-900 font-medium mb-1">Aucune réponse pour le moment</h3>
        <p className="text-gray-500 text-sm">Soyez le premier à répondre à cette question !</p>
      </div>
    )
  }

  const topLevelAnswers = data.filter(a => !a.parentAnswerId)

  return (
    <div className="mt-6 px-6">
      {/* Header des réponses */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
         
        </h3>
        
        {/* Tri des réponses */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Trier par :</span>
          <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="votes">Popularité</option>
            <option value="recent">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
          </select>
        </div>
      </div>

      {/* Liste des réponses */}
      <div className="space-y-6">
        {topLevelAnswers.map((answer) => (
          <div key={answer.id}>
            <AnswerThread answer={answer} questionId={questionId} />
          </div>
        ))}
      </div>

      {topLevelAnswers.length >= 10 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Voir plus de réponses
          </button>
        </div>
      )}
    </div>
  )
}