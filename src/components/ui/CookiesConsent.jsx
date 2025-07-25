import React, { useState } from 'react';

const COOKIE_CATEGORIES = {
  necessary : 'Fonctionnels',
  statistics: 'Statistiques',
  marketing : 'Marketing',
};

export default function CookieConsent() {
  // Lazy init: read existing consent or null
  const [consent, setConsent] = useState(() => {
    try {
      const raw = localStorage.getItem('cookie_consent');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // If already consented (and not customizing), don't show
  if (consent && !consent.showModal) return null;

  const acceptAll = () => {
    const c = { necessary: true, statistics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(c));
    setConsent(c);
  };

  const rejectAll = () => {
    const c = { necessary: true, statistics: false, marketing: false };
    localStorage.setItem('cookie_consent', JSON.stringify(c));
    setConsent(c);
  };

  const customize = () => setConsent({ showModal: true });

  const saveCustom = (updated) => {
    const c = { necessary: true, ...updated };
    localStorage.setItem('cookie_consent', JSON.stringify(c));
    setConsent(c);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
        {!consent?.showModal ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des cookies</h2>
            <p className="text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience sur TripGenius.
              Vous pouvez <strong>accepter</strong> tous les cookies, <strong>refuser</strong>, ou
              <strong> personnaliser</strong> vos préférences.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={rejectAll}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Refuser
              </button>
              <button
                onClick={customize}
                className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
              >
                Personnaliser
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Accepter
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Personnaliser les cookies</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target));
                saveCustom({
                  statistics: data.statistics === 'on',
                  marketing : data.marketing === 'on',
                });
              }}
              className="space-y-3"
            >
              {Object.entries(COOKIE_CATEGORIES).map(([key, label]) => {
                const id = `cookie-${key}`;
                return (
                  <div key={key} className="flex items-center">
                    <input
                      id={id}
                      type="checkbox"
                      name={key}
                      defaultChecked={key === 'necessary'}
                      disabled={key === 'necessary'}
                      className="mr-2 accent-indigo-600"
                      aria-label={label}
                    />
                    <label htmlFor={id} className="text-gray-700">
                      {label}
                    </label>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Valider
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
