import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
//Criando interface para servir como propriedade no App.tsx:
//Isso auxilia na comunicação de um componente com outros.
interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}
//Inicializando variável como nula para poder iniciar e pausar:
let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard(props: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('');

  /*Função para habilitar o campo de texto caso o usuário escolha digitar */
  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }
  /*Capturando eventos com onChange. */
  /*Se o usuário apagar o texto até que o campo fique vazio, ele volta com as opões de gravar ou digitar */
  /*"ChangeEvent<HTMLTextAreaElement>" serve para conseguir pegar o "value" do event. */
  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    
    if(event.target.value === '') {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    
    if (content === '') {
      return
    }

    props.onNoteCreated(content);
    setContent('');
    setShouldShowOnboarding(true);
    
    toast.success("Nota criada com sucesso!😁");
  }

  const [isRecording, setIsRecording] = useState(false);
  //Funções para gravação de áudio:
  function handleStartRecording() {
    //Verificando se o navegador possui a API de gravação:
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação...😞")
      return
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    //Para funcionar o SpeechRecognition deve-se baixar o pacote "npm i -D @types/dom-speech-recognition"
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    //A gravação só vai parar quando alterar o estado para false:
    speechRecognition.continuous = true;
    //Trazendo somente uma alternativa (para palavras técnicas ditas) que tenha mais chance de ser:
    speechRecognition.maxAlternatives = 1;
    //Serve para os resultados virão conforme a fala e não somente quando parar de falar:
    speechRecognition.interimResults = true;
    //Recebendo e exibindo os resultados:
    speechRecognition.onresult = (event) => {
     const transcription = Array.from(event.results).reduce((text, result) => {
      return text.concat(result[0].transcript)
     }, '')

     setContent(transcription);
    }

    speechRecognition.onerror = (event) => {
      console.error(event);
    }

    speechRecognition.start();
  }
  function handleStopRecording() {
    setIsRecording(false);

    if(speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 hover:ring-slate-100 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar uma nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida em texto automaticamente ou digite um texto.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:letf-1/2 md:top-1/2 md:translate-x-3/4 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota:
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                Comece <button type="button" className="font-bold text-lime-400 hover:text-lime-300 hover:underline" onClick={handleStartRecording}>gravando uma nota em áudio</button> ou se preferir utilize <button type="button" className="font-bold text-lime-400 hover:text-lime-300 hover:underline" onClick={handleStartEditor}> apenas texto.</button>
                </p>
              ) : (
                <textarea autoFocus
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none" onChange={handleContentChange} value={content}/>
              )}
            </div>

            {isRecording ? (
              <button
              type="button"
              onClick={handleStopRecording}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:text-slate-100 py-4 text-center text-sm text-slate-300 font-bold outline-none"
            >
              <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
              <span className="text-slate-300">
                Gravando...🎙️(Clique para interromper)
              </span>
            </button>
            ) : (
              <button
              type="button"
              onClick={handleSaveNote}
              className="w-full bg-lime-400 hover:bg-lime-400/60 py-4 text-center text-sm text-slate-300 font-bold outline-none"
            >
              <span className="text-slate-900">Salvar nota</span>
            </button>
            )} 
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
