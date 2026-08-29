export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL TikTok tidak boleh kosong' });
  }

  try {
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        url: url,
        hd: '1',
      }),
    });

    const data = await response.json();

    if (data.code === 0) {
      return res.status(200).json({
        success: true,
        title: data.data.title,
        cover: data.data.cover,
        play: data.data.play, // Video no watermark
        music: data.data.music,
        author: data.data.author.nickname,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Gagal mengambil data video. Pastikan link valid.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
}
