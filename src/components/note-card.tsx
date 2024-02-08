import * as Dialog from "@radix-ui/react-dialog";
/*lib para lidar com datas, instalada através do "npm i date-fns" */
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
/*lib de ícones instalada através do "npm i lucide-react" */
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string
    date: Date
    content: string
  }

  onNoteDelete: (id: string) => void
}

export function NoteCard(props: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left flex flex-col rounded-md bg-slate-800 p-5 gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(props.note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{props.note.content}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:letf-1/2 md:top-1/2 md:translate-x-3/4 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(props.note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm leading-6 text-slate-400">
              {props.note.content}
            </p>
          </div>
          <button
            type="button"
            onClick={() => props.onNoteDelete(props.note.id)}
            className="w-full bg-slate-800 hover:bg-slate-100 py-4 text-center text-sm text-slate-300 font-bold outline-none"
          >
            <span className="text-red-400">Apagar nota</span>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
