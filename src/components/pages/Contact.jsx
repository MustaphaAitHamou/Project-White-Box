import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Footer from '~/view-trip/components/Footer';

export default function Contact() {
  const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_email: email,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setStatus('Message envoyé avec succès ✅');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Erreur EmailJS:', error);
        setStatus("Erreur lors de l'envoi ❌");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-10 rounded-xl w-full max-w-md space-y-6 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-center">Signaler un bug 🐞</h1>

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

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-md"
          >
            Envoyer
          </button>

          {status && (
            <p className="text-center text-sm mt-2 text-green-400">{status}</p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
