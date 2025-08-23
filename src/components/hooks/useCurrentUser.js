/* eslint-env browser */
import { useState, useEffect } from 'react';

/**
 * Hook léger pour suivre l’utilisateur courant via localStorage.
 * Je lis une première fois la clé "user" au montage,
 * puis j’écoute l’événement "storage" pour réagir aux changements
 * faits depuis d’autres onglets/fenêtres.
 */
export default function useCurrentUser() {
  // Je tente de parser la valeur persistée ; en cas d’erreur, je reviens à null.
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  useEffect(() => {
    // Je mets à jour l’état quand localStorage change ailleurs.
    const onStorage = () => {
      try { setUser(JSON.parse(localStorage.getItem('user'))); } catch { setUser(null); }
    };
    window.addEventListener('storage', onStorage);
    // Je nettoie l’écouteur au démontage.
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Je renvoie l’utilisateur courant et le setter pour usage manuel si besoin.
  return { user, setUser };
}
