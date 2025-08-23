/* ------------------------------------------------------------------
   src/components/custom/Header.jsx
   – Gestion utilisateur + export JSON complet des voyages
------------------------------------------------------------------- */
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FaSignOutAlt,
  FaFileDownload,
  FaTrashAlt,
  FaSpinner,
} from "react-icons/fa";
import { db } from "@/service/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc as docRef,
} from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";

/* ------------------------------------------------------------------ */
/*  utils                                                               */
/* ------------------------------------------------------------------ */

/** Déclenche un téléchargement (client‐side, sans lib externe)
 *  Je transforme l’objet en Blob JSON, je crée une URL temporaire,
 *  puis je clique un <a download> injecté dynamiquement. */
function downloadJSON(obj, filename = "tripgenius-data.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  config                                                             */
/* ------------------------------------------------------------------ */

// Je détecte iOS pour forcer ux_mode=redirect (popup souvent bloqué).
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

// Je lis la clé reCAPTCHA injectée côté client via window.__ENV__.
// En tests, j’attends que __ENV__ soit fourni par un mock.
const RECAPTCHA_KEY =
  typeof window !== "undefined" && window.__ENV__?.VITE_RECAPTCHA_SITE_KEY
    ? window.__ENV__.VITE_RECAPTCHA_SITE_KEY
    : "";

// Je n’active reCAPTCHA que si j’ai une clé et que je ne suis pas sur iOS.
const useRecaptcha = Boolean(RECAPTCHA_KEY) && !isIOS;

/* ------------------------------------------------------------------ */
/*  composant                                                           */
/* ------------------------------------------------------------------ */

export default function Header() {
  /* ---------- état utilisateur ---------- */
  // Au premier rendu, je tente de restaurer l’utilisateur depuis localStorage.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  /* ---------- autres états ---------- */
  // showLogin: ouvre/ferme la modale d’auth
  // showDelete: ouvre/ferme la modale de suppression du compte
  // confirmEmail: champ de confirmation avant suppression Firestore
  // agree: consentement RGPD obligatoire avant déclenchement du login
  // error: message d’erreur local pour la modale d’auth
  // exporting: état de chargement pendant l’export JSON
  const [showLogin, setShowLogin] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  // Je garde une ref sur le widget reCAPTCHA (mode invisible).
  const recaptchaRef = useRef(null);

  /* ----------------------------------------------------------------
     synchro cross-tab
  ---------------------------------------------------------------- */
  // Je synchronise le state user entre onglets/fenêtres via:
  // - l’événement "storage" (localStorage modifié)
  // - un événement custom "userChanged" que je déclenche après login/logout
  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("userChanged", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userChanged", syncUser);
    };
  }, []);

  /* ----------------------------------------------------------------
     OAuth Google
  ---------------------------------------------------------------- */
  // Je prépare le handler de login Google.
  // - onSuccess: je récupère le profil via l’access_token et je persiste l’utilisateur
  // - ux_mode: popup sauf sur iOS où je force la redirection
  const login = useGoogleLogin({
    onSuccess: handleProfile,
    onError: () => toast.error("Échec de l’authentification Google"),
    scope: "openid email profile",
    ux_mode: isIOS ? "redirect" : "popup",
    redirect_uri: window.location.origin + "/",
  });

  // Je récupère le profil Google avec l’access_token, je persiste dans localStorage
  // puis je ferme la modale et je notifie via l’événement "userChanged".
  async function handleProfile({ access_token }) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
      );
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));
      setUser(data);
      setShowLogin(false);
    } catch {
      toast.error("Impossible de récupérer les informations Google");
    }
  }

  /* ----------------------------------------------------------------
     reCAPTCHA
  ---------------------------------------------------------------- */
  // reCAPTCHA invisible: une fois validé, j’enchaîne le login Google.
  const onRecaptchaDone = (token) => {
    if (!token) {
      toast.error("Échec reCAPTCHA, réessayez.");
      return;
    }
    recaptchaRef.current.reset();
    login();
  };

  // Je refuse de continuer si le consentement n’est pas coché,
  // sinon je déclenche reCAPTCHA (si activé) ou le login directement.
  const handleContinue = () => {
    if (!agree) {
      setError("Vous devez accepter la collecte de données.");
      return;
    }
    if (useRecaptcha) recaptchaRef.current.execute();
    else login();
  };

  /* ----------------------------------------------------------------
     logout + suppression compte
  ---------------------------------------------------------------- */
  // Je nettoie la session: révoque côté Google, purge localStorage,
  // puis je notifie les autres onglets.
  const logout = () => {
    googleLogout();
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
  };

  // Je supprime toutes les données Firestore liées à l’utilisateur:
  // - tous ses documents AITrips
  // - son document de consentement
  // puis je déconnecte l’utilisateur.
  const deleteAccount = async () => {
    if (!user) return;
    if (confirmEmail !== user.email) {
      toast.error("E-mail incorrect.");
      return;
    }
    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email)
      );
      const snap = await getDocs(q);
      await Promise.all(
        snap.docs.map((d) => deleteDoc(docRef(db, "AITrips", d.id)))
      );
      await deleteDoc(docRef(db, "consents", user.id));
      logout();
      toast.success("Compte supprimé.");
    } catch (err) {
      toast.error("Erreur suppression : " + err.message);
    }
  };

  /* ----------------------------------------------------------------
     export JSON complet
  ---------------------------------------------------------------- */
  // Je récupère tous les voyages de l’utilisateur puis je déclenche
  // un téléchargement JSON côté navigateur. Je gère un état de chargement
  // et j’affiche des toasts en cas de succès/absence d’éléments/erreur.
  const exportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      // Récupère tous les voyages de l’utilisateur
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email)
      );
      const snap = await getDocs(q);
      const trips = snap.docs.map((d) => d.data());

      if (!trips.length) {
        toast.info("Aucun voyage à exporter.");
      } else {
        downloadJSON({ user, trips }, "tripgenius-data.json");
        toast.success("Export JSON téléchargé.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur export : " + err.message);
    } finally {
      setExporting(false);
    }
  };

  /* ============================= RENDER ========================== */
  return (
    <>
      {/* ------------------ Navbar ------------------ */}
      {/* Je garde la barre fixe avec un blur pour la lisibilité sur fonds variés. */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-md shadow bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo + titre du site */}
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            <span className="text-xl font-bold text-white">TripGenius</span>
          </a>

          {/* Navigation principale */}
          <nav className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            <a href="/create-trip" className="text-white hover:text-indigo-200">
              Planifier
            </a>
            {user && (
              <a href="/my-trips" className="text-white hover:text-indigo-200">
                Mes voyages
              </a>
            )}
          </nav>

          {/* --------- zone droite --------- */}
          {user ? (
            // Menu utilisateur avec avatar (Popover)
            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={user.picture}
                  alt="avatar"
                  className="h-10 w-10 cursor-pointer rounded-full ring-2 ring-indigo-400"
                />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-56 rounded-lg p-2 shadow-lg bg-white"
              >
                {/* Déconnexion */}
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FaSignOutAlt className="mr-2" /> Se déconnecter
                </Button>

                {/* Export JSON complet */}
                <Button
                  onClick={exportData}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  disabled={exporting}
                >
                  {exporting ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaFileDownload className="mr-2" />
                  )}
                  Télécharger mes données
                </Button>

                {/* Suppression du compte (ouvre une modale de confirmation) */}
                <Button
                  onClick={() => setShowDelete(true)}
                  variant="solid"
                  size="sm"
                  className="w-full justify-center bg-red-600 text-white"
                >
                  <FaTrashAlt className="mr-2" /> Supprimer mon compte
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            // Bouton de connexion si aucun utilisateur en session
            <Button
              onClick={() => setShowLogin(true)}
              variant="gradient"
              className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-2 text-white shadow-lg"
            >
              Se connecter
            </Button>
          )}
        </div>
      </header>

      {/* ---------------- Dialog Login ---------------- */}
      {/* Je présente une modale avec consentement RGPD, bouton Google et reCAPTCHA invisible. */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-12" />
              Connexion Google
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Authentifiez-vous pour commencer votre aventure.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-start gap-2">
            <input
              id="rgpd"
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setError("");
              }}
              className="mt-1"
            />
            <label htmlFor="rgpd" className="text-sm text-gray-700">
              J’accepte l’utilisation de mes données par TripGenius.{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                En savoir plus
              </a>
            </label>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <Button
            className="mt-6 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            onClick={handleContinue}
          >
            <FcGoogle className="h-6 w-6" /> Continuer avec Google
          </Button>

          {useRecaptcha && (
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={RECAPTCHA_KEY}
              onChange={onRecaptchaDone}
              onErrored={() => {
                toast.error("reCAPTCHA hors-service, connexion directe.");
                login();
              }}
            />
          )}

          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer"
              className="absolute top-4 right-4 rounded-full bg-white p-2 shadow"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* -------------- Dialog suppression -------------- */}
      {/* Je demande une confirmation d’e-mail avant d’effacer toutes les données. */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogOverlay />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 text-center">
              Suppression du compte
            </DialogTitle>
            <DialogDescription className="text-center mb-4">
              Saisis ton e-mail pour confirmer :
            </DialogDescription>
          </DialogHeader>

          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
            className="mb-6 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={deleteAccount}>
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
