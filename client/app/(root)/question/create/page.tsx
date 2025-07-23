"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateQuestion } from '@/features/question/hooks/use-question'
import { useTopics } from '@/features/topic/hooks/use-topic'
import { useCreateTopic } from '@/features/topic/hooks/use-topic'
import { Button } from '@/shared/components/atoms/ui/button'
import { Input } from '@/shared/components/atoms/ui/input'
import { Textarea } from '@/shared/components/atoms/ui/textarea'
import { Badge } from '@/shared/components/atoms/ui/badge'


const pollOptionSchema = z.object({
  value: z.string().min(1, 'L’option ne peut pas être vide')
})


const askQuestionSchema = z.object({
  title: z.string().min(10, 'La question doit contenir au moins 10 caractères'),
  details: z.string().optional(),
  topicId: z.string().min(1, 'Sélectionnez un topic'),
  anonymous: z.boolean().optional(),
  type: z.enum(['classic', 'poll']).default('classic'),
  pollOptions: z.array(pollOptionSchema).optional()
}).superRefine((data, ctx) => {
  if (data.type === 'poll') {
    if (!Array.isArray(data.pollOptions) || data.pollOptions.length < 2 || data.pollOptions.some(opt => !opt.value.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ajoutez au moins 2 options de sondage non vides',
        path: ['pollOptions']
      })
    }
  }
})

type AskQuestionForm = z.infer<typeof askQuestionSchema>


export default function CreateQuestionPage() {
  const { mutate: createQuestion, isPending, error } = useCreateQuestion()
  const { data: topics } = useTopics()
  const { mutate: createTopic, isPending: creatingTopic } = useCreateTopic()
  const [newTopic, setNewTopic] = useState('')
  const [creating, setCreating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<AskQuestionForm>({
    resolver: zodResolver(askQuestionSchema),
    mode: 'onChange',
    defaultValues: { anonymous: false, topicId: '', type: 'classic', pollOptions: [{ value: '' }, { value: '' }] }
  })

  const type = watch('type')
  const pollOptions = watch('pollOptions') || []

  const onSubmit = (data: AskQuestionForm) => {
    const payload: {
      title: string;
      body: string;
      topicId: string;
      anonymous?: boolean;
      type: 'classic' | 'poll';
      pollOptions?: { value: string }[];
    } = {
      title: data.title,
      body: data.details || '',
      topicId: data.topicId,
      anonymous: data.anonymous,
      type: data.type,
    }
    if (data.type === 'poll') {
      payload.pollOptions = (data.pollOptions || []).map((opt: { value: string }) => ({ value: opt.value }))
    }
    createQuestion(payload, {
      onSuccess: () => {
        reset()
      }
    })
  }

  const handleCreateTopic = () => {
    if (!newTopic.trim()) return
    createTopic({ name: newTopic }, {
      onSuccess: (created) => {
        setCreating(false)
        setNewTopic('')
        if (created && created.data && created.data.id) {
          setValue('topicId', created.data.id)
        }
      }
    })
  }

  const handleAddOption = () => {
    setValue('pollOptions', [...pollOptions, { value: '' }])
  }

  const handleRemoveOption = (idx: number) => {
    if (pollOptions.length <= 2) return
    setValue('pollOptions', pollOptions.filter((_, i: number) => i !== idx))
  }

  return (
    <div className="w-full max-w-lg bg-white p-6 my-3 mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Poser une question</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="classic"
              {...register('type')}
              checked={type === 'classic'}
              onChange={() => setValue('type', 'classic')}
            />
            Question classique
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="poll"
              {...register('type')}
              checked={type === 'poll'}
              onChange={() => setValue('type', 'poll')}
            />
            Sondage
          </label>
        </div>
        <Input
          placeholder="Ex: Comment fonctionne Quora ?"
          {...register('title')}
          autoFocus
        />
        {errors.title && <div className="text-xs text-red-500">{errors.title.message}</div>}
        <Textarea
          placeholder="Ajoutez des précisions à votre question"
          {...register('details')}
        />
        {errors.details && <div className="text-xs text-red-500">{errors.details.message}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.isArray(topics) && topics.length > 0 && topics.map((topic) => {
              const selected = watch('topicId') === topic.id
              return (
                <Badge
                  key={topic.id}
                  variant={selected ? 'default' : 'outline'}
                  className={selected ? 'cursor-pointer border-primary bg-primary text-white' : 'cursor-pointer'}
                  tabIndex={0}
                  onClick={() => setValue('topicId', topic.id)}
                >
                  {topic.name}
                </Badge>
              )
            })}
            <Badge
              variant={creating ? 'default' : 'outline'}
              className="cursor-pointer border-dashed border-primary"
              tabIndex={0}
              onClick={() => setCreating(true)}
            >
              + Nouveau topic
            </Badge>
          </div>
          {errors.topicId && <div className="text-xs text-red-500">{errors.topicId.message as string}</div>}
          {creating && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Nom du nouveau topic"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                disabled={creatingTopic}
              />
              <Button type="button" onClick={handleCreateTopic} disabled={creatingTopic || !newTopic.trim()}>
                Créer
              </Button>
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                Annuler
              </Button>
            </div>
          )}
        </div>
        {type === 'poll' && (
          <div className="bg-gray-50 rounded p-4">
            <div className="font-medium mb-2">Options du sondage</div>
            {pollOptions.map((opt: { value: string }, idx: number) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={opt.value}
                  onChange={e => {
                    const next = [...pollOptions]
                    next[idx] = { value: e.target.value }
                    setValue('pollOptions', next, { shouldValidate: true })
                  }}
                  className="flex-1"
                />
                {pollOptions.length > 2 && (
                  <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveOption(idx)} aria-label="Supprimer l'option">
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddOption} className="mt-2">
              + Ajouter une option
            </Button>
            {errors.pollOptions && <div className="text-xs text-red-500 mt-2">{errors.pollOptions.message as string}</div>}
          </div>
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('anonymous')} />
          Poser anonymement
        </label>
        {error && <div className="text-red-500 text-xs">{error.message}</div>}
        <Button type="submit" disabled={!isValid || isPending} className="w-full">
          Publier
        </Button>
      </form>
    </div>
  )
}
