import React from "react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import Footer from "~/view-trip/components/Footer"

export default function Hero() {
  return (
    <>
      {/* Bannière pleine page, dégradé gris sobre */}
      <section className="relative flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            <span className="text-indigo-400">Embarquez</span> vers l'inconnu
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-gray-300 max-w-xl mx-auto">
            Votre planificateur de voyage alimenté par&nbsp;l’IA.
          </p>

          <Link to="/create-trip">
            <Button
              size="lg"
              className="mt-10 bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
            >
              Démarrer l’aventure
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
