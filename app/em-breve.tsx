import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-indigo-50 to-white p-6 text-center">
      <h1 className="text-brand-blue mb-8 text-5xl font-sifonn leading-tight font-bold">Em breve...</h1>


      <Link
        href="/"
        className="bg-brand-blue hover:bg-brand-blue/90 rounded-md px-6 py-3 text-white transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
