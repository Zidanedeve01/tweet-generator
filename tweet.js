export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Metode tidak diizinkan' });
      return;
    }

    const { profile, name, username, tweet, retweets, likes } = req.body;

    if (!name || !username || !tweet) {
      res.status(400).json({ error: "Data tidak lengkap" });
      return;
    }

    // Tentukan URL profil default jika field 'profile' kosong
    const defaultProfileUrl = 'https://files.catbox.moe/f7g0nx.jpg'; 
    const finalProfileUrl = profile ? profile : defaultProfileUrl;

    // Bangun URL API eksternal dengan URL profil yang sudah ditentukan
    const apiUrl = `https://api.siputzx.my.id/api/m/tweet?profile=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F159487561%3Fv%3D4&name=siputzx&username=siputzx&tweet=Hello%20World&image=null&theme=dark&retweets=1000&quotes=200&likes=5000&client=Twitter%20for%20iPhone';
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ error: "Gagal mengambil data dari API eksternal", details: errorText });
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="tweet.png"');
    res.status(200).send(buffer);

  } catch (error) {
    res.status(500).json({ error: "Gagal memproses permintaan", details: error.message });
  }
}
