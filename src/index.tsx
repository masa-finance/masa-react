import * as buffer from 'buffer';

// * nextjs fix
if (typeof window !== 'undefined') {
  window.Buffer = buffer.Buffer;
}

export {
  openCreateSoulnameModal,
  openAuthenticateModal,
  MasaProvider as MasaRefactorProvider,
  MasaProvider,
} from './refactor';
