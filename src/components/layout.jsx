// src/components/Layout.jsx

export default function Layout() {
  return (
    <>
      <Header />

      {/* Le main est transparent pour laisser voir le gradient */}
      <main className="pt-20 bg-transparent min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
