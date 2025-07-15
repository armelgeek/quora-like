'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteIcon, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/atoms/ui/alert-dialog';
import { DropdownMenuItem } from '@/shared/components/atoms/ui/dropdown-menu';

interface EntityDeleteProps {
  entityId: string;
  entityName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteService: (id: string) => Promise<any>;
  queryKey: readonly string[];
  onActionComplete?: () => void;
}

export function EntityDelete({
  entityId,
  entityName,
  deleteService,
  queryKey,
  onActionComplete
}: EntityDeleteProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      onActionComplete?.();
    },
  });

  const handleDelete = async (id: string) => {
    mutate(id);
    setIsOpen(false);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive focus:text-destructive"
        >
          <DeleteIcon size={16} className='mr-2' />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {entityName}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {entityName.toLowerCase()}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(entityId)}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete {entityName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
