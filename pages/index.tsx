import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="public-home">
      <section aria-labelledby="home-title" className="public-home-content">
        <h1 id="home-title">Hello World</h1>
        <Link href="/login">Entrar</Link>
      </section>
    </main>
  );
}
