import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Gagal memproses URL');
      }
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>TikTok Downloader Tanpa Watermark</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="max-w-md w-full bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-2xl font-bold text-center mb-2 text-cyan-400">TikTok Downloader</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Unduh video TikTok tanpa watermark dengan mudah</p>

        <form onSubmit={handleDownload} className="space-y-4">
          <input
            type="url"
            placeholder="Tempel link TikTok di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Download Video'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}

        {result && (
          <div className="mt-6 border-t border-slate-700 pt-4 flex flex-col items-center">
            <img src={result.cover} alt="Thumbnail" className="w-48 h-48 object-cover rounded-lg mb-3" />
            <p className="text-sm text-center font-semibold mb-1">{result.title}</p>
            <p className="text-xs text-gray-400 mb-4">By: @{result.author}</p>
            <a
              href={result.play}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
            >
              Unduh MP4 (No Watermark)
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
