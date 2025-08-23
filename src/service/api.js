// src/service/api.js

/**
 * Stub utilitaire pour les tests.
 * Ici je simule la récupération d’une photo à partir d’un placeId
 * en renvoyant une URL déterministe. Ça me permet d’éviter tout
 * appel réseau pendant les tests d’interface.
 *
 * @param {string} placeId  Identifiant du lieu (ex: "places/xxx/photos/abc")
 * @returns {Promise<string>}  URL d’image factice basée sur placeId
 */
export const GetPlacePhoto = (placeId) => {
  return Promise.resolve(`https://mocked.com/${placeId}.jpg`);
};
