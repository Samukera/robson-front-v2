import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'pt-BR' | 'en-US';

type Dictionary = Record<string, string>;

const STORAGE_KEY = 'robson:language';

const dictionaries: Record<Language, Dictionary> = {
  'pt-BR': {
    'common.online': 'online',
    'common.offline': 'offline',
    'common.copy': 'Copiar',
    'common.copied': 'Copiado!',
    'common.share': 'Compartilhar',
    'common.settings': 'Configurações',
    'common.enter': 'Entrar',
    'common.player': 'Player',
    'common.observer': 'Observador',
    'home.subtitle': 'Planeje com sua equipe',
    'home.description': 'Robson e uma interface criada para facilitar processos de planejamento e dinamicas de planning poker com sua equipe.',
    'home.createRoom': 'Criar Sala',
    'header.tasks': 'Tarefas',
    'header.legend': 'Legenda',
    'header.noActiveTask': 'Sem tarefa ativa',
    'game.revealVotes': 'Revelar Votos',
    'game.result': 'Resultado',
    'game.restart': 'Reiniciar',
    'game.nextTask': 'Próxima Tarefa',
    'game.loadingRoom': 'Conectando à sala...',
    'game.countdown': 'Revelando em',
    'game.observerTag': 'OBS',
    'settings.title': 'Configurações',
    'settings.theme': 'Tema visual',
    'settings.themeDefault': 'Padrão atual',
    'settings.themeLagoon': 'Lagoon',
    'settings.themeMinimal': 'Moderno minimalista',
    'settings.themePoker': 'Poker feltro verde',
    'settings.language': 'Idioma',
    'settings.format': 'Formato das cartas',
    'settings.description': 'Configure o formato do jogo.',
    'share.title': 'Convidar Time',
    'share.description': 'Compartilhe o link com sua equipe para começar a jogar.',
    'share.qr': 'QR Code da sala',
    'tasks.title': 'Tarefas',
    'tasks.empty': 'Nenhuma tarefa cadastrada.',
    'tasks.add': 'Adicionar tarefa',
    'tasks.export': 'Exportar CSV',
    'tasks.done': 'Concluída',
    'tasks.placeholder': 'Nome da tarefa',
    'legend.title': 'Legenda de Pontuação',
    'legend.addRow': 'Adicionar linha',
    'nickname.title': 'Entrar na sala',
    'nickname.description': 'Digite seu nome e escolha seu papel na sala.',
    'nickname.name': 'Nome',
    'nickname.role': 'Papel',
    'nickname.playerDesc': 'Player (vota nas cartas)',
    'nickname.observerDesc': 'Coordenador (observa e conduz a sala)',
    'emoji.send': 'Enviar emoji',
  },
  'en-US': {
    'common.online': 'online',
    'common.offline': 'offline',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.share': 'Share',
    'common.settings': 'Settings',
    'common.enter': 'Join',
    'common.player': 'Player',
    'common.observer': 'Observer',
    'home.subtitle': 'Plan with your team',
    'home.description': 'Robson is an interface built to simplify planning workflows and planning poker sessions with your team.',
    'home.createRoom': 'Create Room',
    'header.tasks': 'Tasks',
    'header.legend': 'Legend',
    'header.noActiveTask': 'No active task',
    'game.revealVotes': 'Reveal Votes',
    'game.result': 'Result',
    'game.restart': 'Restart',
    'game.nextTask': 'Next Task',
    'game.loadingRoom': 'Connecting to room...',
    'game.countdown': 'Revealing in',
    'game.observerTag': 'OBS',
    'settings.title': 'Settings',
    'settings.theme': 'Visual theme',
    'settings.themeDefault': 'Current default',
    'settings.themeLagoon': 'Lagoon',
    'settings.themeMinimal': 'Modern minimal',
    'settings.themePoker': 'Green felt poker',
    'settings.language': 'Language',
    'settings.format': 'Card format',
    'settings.description': 'Configure game format.',
    'share.title': 'Invite Team',
    'share.description': 'Share the room link with your team.',
    'share.qr': 'Room QR Code',
    'tasks.title': 'Tasks',
    'tasks.empty': 'No tasks created yet.',
    'tasks.add': 'Add task',
    'tasks.export': 'Export CSV',
    'tasks.done': 'Done',
    'tasks.placeholder': 'Task name',
    'legend.title': 'Score Legend',
    'legend.addRow': 'Add row',
    'nickname.title': 'Join room',
    'nickname.description': 'Enter your name and choose your role.',
    'nickname.name': 'Name',
    'nickname.role': 'Role',
    'nickname.playerDesc': 'Player (votes on cards)',
    'nickname.observerDesc': 'Coordinator (observes and guides room)',
    'emoji.send': 'Send emoji',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt-BR' || stored === 'en-US') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => dictionaries[language][key] || key,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
