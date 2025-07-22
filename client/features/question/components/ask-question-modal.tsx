"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateQuestion } from '../hooks/use-question'
import { useTopics } from '../../topic/hooks/use-topic'
import { useCreateTopic } from '../../topic/hooks/use-topic'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/components/atoms/ui/dialog'
import { Button } from '@/shared/components/atoms/ui/button'
import { Input } from '@/shared/components/atoms/ui/input'
import { Textarea } from '@/shared/components/atoms/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/shared/components/atoms/ui/select'

const askQuestionSchema = z.object({
  title: z.string().min(10, 'La question doit contenir au moins 10 caractères'),
  details: z.string().optional(),
  topicId: z.string().min(1, 'Veuillez sélectionner un topic'),
  anonymous: z.boolean().optional()
})

type AskQuestionForm = z.infer<typeof askQuestionSchema>

export function AskQuestionModal() {
  const [open, setOpen] = useState(false)
  const { mutate: createQuestion, isPending, error } = useCreateQuestion()
  const { data: topics, isLoading: topicsLoading } = useTopics()
  const { mutate: createTopic, isPending: creatingTopic } = useCreateTopic()
  const [newTopic, setNewTopic] = useState('')
  const [creating, setCreating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<AskQuestionForm>({
    resolver: zodResolver(askQuestionSchema),
    mode: 'onChange',
    defaultValues: { anonymous: false }
  })

  // const { data: suggestions } = useQuestionSuggestions(watch('title')) // à créer si besoin

  const onSubmit = (data: AskQuestionForm) => {
    const payload = {
      title: data.title,
      body: data.details || '',
      topicId: data.topicId,
    }
    createQuestion(payload, {
      onSuccess: () => {
        reset()
        setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Poser une question</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Poser une question</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Ex: Comment fonctionne Quora ?"
            {...register('title')}
            autoFocus
          />
          {errors.title && <div className="text-xs text-red-500">{errors.title.message}</div>}
          {/* Suggestions dynamiques ici */}
          {/* {suggestions && suggestions.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Suggestions similaires :
              <ul>
                {suggestions.map((s) => (
                  <li key={s.id}>{s.title}</li>
                ))}
              </ul>
            </div>
          )} */}
          <Textarea
            placeholder="Ajoutez des précisions à votre question"
            {...register('details')}
          />
          {errors.details && <div className="text-xs text-red-500">{errors.details.message}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <Select
              onValueChange={value => {
                if (value === '__create__') {
                  setCreating(true)
                } else {
                  setValue('topicId', value)
                }
              }}
              disabled={topicsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={topicsLoading ? 'Chargement...' : 'Sélectionnez un topic'} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(topics) && topics.length > 0 && topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                ))}
                <SelectItem value="__create__">
                  + Créer un nouveau topic
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.topicId && <div className="text-xs text-red-500">{errors.topicId.message}</div>}
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
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('anonymous')} />
            Poser anonymement
          </label>
          {error && <div className="text-red-500 text-xs">{error.message}</div>}
          <Button type="submit" disabled={!isValid || isPending} className="w-full">
            Publier
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
