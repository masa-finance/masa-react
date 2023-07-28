import * as buffer from 'buffer';

// * nextjs fix
if (typeof window !== 'undefined') {
  window.Buffer = buffer.Buffer;
}

export {
  openCreateSoulnameModal,
  MasaProvider as MasaRefactorProvider,
} from './refactor';

export * from './components';
export * from './helpers';
export * from './provider';
