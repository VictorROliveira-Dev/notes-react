import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  //Definindo o formato do array das notas, utilizando a interface "Note".
  //Criando uma função no useState para devolver o valor inicial do estado, podendo pegar itens em local storage.
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      //"crypto.randomUUID" vai gerar um id único e universal em formato de string.
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    /*Atualizando a exibição na tela com a nota novas + as notas antigas */
    setNotes(notesArray);
    //Salvando notas em local storage:
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDelete(id: string) {
    //Filtrando e devolvendo um array sem que tenha a nota com id escolhido, para deleção
    const notesArray = notes.filter(note => {
      return note.id !== id;
    })

    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  const [search, setSearch] = useState("");
  // Função para buscar cards:
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }
  //Filtro de busca
  const filteredNotes =
    search !== ""
      ? notes.filter((note) => note.content.toLowerCase().includes(search.toLowerCase()))
      : notes;

  return (
    <div className="my-12 mx-auto max-w-6xl space-y-6 px-5">
      <form className="w-full ">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete}/>;
        })}
      </div>
    </div>
  );
}
