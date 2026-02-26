import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { DumpItem } from '../lib/supabase'

export function useItems(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery<DumpItem[]>({
    queryKey: ['items', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId!)
        .eq('status', 'inbox')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })

  const addItem = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('items')
        .insert({
          user_id: userId!,
          content,
          status: 'inbox',
          xp_value: 10,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] })
    },
  })

  const completeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items')
        .update({ status: 'done' })
        .eq('id', itemId)

      if (error) throw error
      return itemId
    },
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ['items', userId] })
      const previous = queryClient.getQueryData<DumpItem[]>(['items', userId])
      queryClient.setQueryData<DumpItem[]>(['items', userId], (old) =>
        (old ?? []).filter((item) => item.id !== itemId)
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items', userId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] })
    },
  })

  const incinerateItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items')
        .update({ status: 'incinerated' })
        .eq('id', itemId)

      if (error) throw error
      return itemId
    },
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ['items', userId] })
      const previous = queryClient.getQueryData<DumpItem[]>(['items', userId])
      queryClient.setQueryData<DumpItem[]>(['items', userId], (old) =>
        (old ?? []).filter((item) => item.id !== itemId)
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['items', userId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items', userId] })
    },
  })

  return { items, isLoading, addItem, completeItem, incinerateItem }
}
