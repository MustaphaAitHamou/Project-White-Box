import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Footer from '~/view-trip/components/Footer';

/**
 * Page de contact pour signaler un bug.
 * Je m’appuie sur EmailJS côté client, avec les identifiants fournis par Vite (import.meta.env).
 * Remarque : je ne touche pas au formulaire ni à la logique, je me contente d’expliquer le flux.
 */
export default function Contact() {
  // Je lis les variables d’environnement injectées au build.
  const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

  // Je gère l’état local du formulaire et le statut d’envoi.
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // Je bloque le submit natif, je construis les params puis j’envoie via EmailJS.
  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_email: email,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        // En cas de succès, je mets à jour le statut et je réinitialise les champs.
        setStatus('Message envoyé avec succès ✅');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        // En cas d’échec, je log l’erreur en console et j’affiche un statut lisible.
        console.error('Erreur EmailJS:', error);
        setStatus("Erreur lors de l'envoi ❌");
      });
  };

  return (
    // Je structure la page en colonne pleine hauteur, avec un main centré et le Footer en bas.
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-10 rounded-xl w-full max-w-md space-y-6 shadow-xl"
        >
          {/* En-tête du formulaire */}
          <h1 className="text-2xl font-bold text-center">Signaler un bug 🐞</h1>

          {/* Champ e-mail contrôlé */}
          <div>
            <label htmlFor="email" className="block mb-2">Votre email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Champ message contrôlé */}
          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              className="w-full h-40 px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* CTA d’envoi */}
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-md"
          >
            Envoyer
          </button>

          {/* Zone de statut (succès/erreur) */}
          {status && (
            <p className="text-center text-sm mt-2 text-green-400">{status}</p>
          )}
        </form>
      </main>
      {/* Pied de page commun */}
      <Footer />
    </div>
  );
}
