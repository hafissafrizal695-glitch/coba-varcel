import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database setup
const db = new Database(join(__dirname, '..', 'data', 'skillshift.db'));

// Create tables dengan schema baru
db.exec(`
  CREATE TABLE IF NOT EXISTS lowongan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    perusahaan TEXT,
    lokasi TEXT,
    tipe TEXT,
    kategori TEXT,
    skill TEXT,
    jam_kerja TEXT,
    minimal_umur INTEGER DEFAULT 18,
    gaji TEXT,
    deskripsi TEXT,
    email_kontak TEXT,
    whatsapp TEXT,
    foto TEXT,
    created_at TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS mahasiswa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS riwayat_accepted (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    id_lowongan INTEGER,
    tanggal_diterima TEXT,
    FOREIGN KEY (id_user) REFERENCES mahasiswa(id),
    FOREIGN KEY (id_lowongan) REFERENCES lowongan(id)
  )
`);

console.log('✅ Schema database baru siap!');

// Seed data jika kosong
const count = db.prepare('SELECT COUNT(*) as count FROM lowongan').get();
if (count.count === 0) {
  const seedJobs = [
    {
      judul: 'Content Creator Intern',
      perusahaan: 'Creative Space ID',
      lokasi: 'Jakarta',
      tipe: 'Hybrid',
      kategori: 'Kreatif',
      skill: 'TikTok,Canva',
      jam_kerja: 'Fleksibel',
      minimal_umur: 18,
      gaji: 'Rp 2.000.000',
      deskripsi: 'Membangun branding visual perusahaan melalui konten media sosial harian.',
      email_kontak: 'hr@creative.id',
      whatsapp: '6281234567890',
      foto: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800',
      created_at: '2026-05-20',
    },
    {
      judul: 'Barista Part-Time',
      perusahaan: 'Kopi Senja',
      lokasi: 'Bandung',
      tipe: 'Onsite',
      kategori: 'F&B',
      skill: 'Komunikasi,Service',
      jam_kerja: 'Shift Sore',
      minimal_umur: 19,
      gaji: 'Rp 1.500.000',
      deskripsi: 'Melayani pelanggan dengan standar pelayanan tinggi di lingkungan yang tenang.',
      email_kontak: 'hr@kopisenja.com',
      whatsapp: '6289876543210',
      foto: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
      created_at: '2026-05-22',
    },
    {
      judul: 'UI/UX Designer',
      perusahaan: 'TechNova',
      lokasi: 'Yogyakarta',
      tipe: 'Remote',
      kategori: 'IT',
      skill: 'Figma,Design',
      jam_kerja: '20 Jam/Minggu',
      minimal_umur: 19,
      gaji: 'Rp 2.500.000',
      deskripsi: 'Merancang antarmuka aplikasi yang intuitif bagi pengguna.',
      email_kontak: 'tech@nova.com',
      whatsapp: '6285522334455',
      foto: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800',
      created_at: '2026-05-23',
    },
  ];

  const insert = db.prepare(`
    INSERT INTO lowongan (judul, perusahaan, lokasi, tipe, kategori, skill, jam_kerja, minimal_umur, gaji, deskripsi, email_kontak, whatsapp, foto, created_at)
    VALUES (@judul, @perusahaan, @lokasi, @tipe, @kategori, @skill, @jam_kerja, @minimal_umur, @gaji, @deskripsi, @email_kontak, @whatsapp, @foto, @created_at)
  `);

  for (const job of seedJobs) {
    insert.run(job);
  }
  console.log('✓ Seed data inserted');
}

// API Routes - Lowongan

// Get all jobs (lowongan)
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = db.prepare('SELECT * FROM lowongan ORDER BY created_at DESC').all();
    // Parse skills from string to array
    const parsed = jobs.map(job => ({
      id: job.id,
      title: job.judul,
      company: job.perusahaan,
      location: job.lokasi,
      type: job.tipe,
      category: job.kategori,
      skills: job.skill ? job.skill.split(',').map(s => s.trim()) : [],
      hours: job.jam_kerja,
      minAge: job.minimal_umur,
      salary: job.gaji,
      description: job.deskripsi,
      contactEmail: job.email_kontak,
      contactPhone: job.whatsapp,
      image: job.foto,
      createdAt: job.created_at,
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single job
app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM lowongan WHERE id = ?').get(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Lowongan tidak ditemukan' });
    }
    const parsed = {
      id: job.id,
      title: job.judul,
      company: job.perusahaan,
      location: job.lokasi,
      type: job.tipe,
      category: job.kategori,
      skills: job.skill ? job.skill.split(',').map(s => s.trim()) : [],
      hours: job.jam_kerja,
      minAge: job.minimal_umur,
      salary: job.gaji,
      description: job.deskripsi,
      contactEmail: job.email_kontak,
      contactPhone: job.whatsapp,
      image: job.foto,
      createdAt: job.created_at,
    };
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job
app.post('/api/jobs', (req, res) => {
  try {
    const {
      title, company, location, type, category, skills,
      hours, minAge, salary, description, contactEmail, contactPhone, image
    } = req.body;

    const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;
    const createdAt = new Date().toISOString().split('T')[0];

    const result = db.prepare(`
      INSERT INTO lowongan (judul, perusahaan, lokasi, tipe, kategori, skill, jam_kerja, minimal_umur, gaji, deskripsi, email_kontak, whatsapp, foto, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, company, location, type, category, skillsStr, hours || '', minAge || 18, salary, description || '', contactEmail || '', contactPhone || '', image || '', createdAt);

    const newJob = db.prepare('SELECT * FROM lowongan WHERE id = ?').get(result.lastInsertRowid);
    const parsed = {
      id: newJob.id,
      title: newJob.judul,
      company: newJob.perusahaan,
      location: newJob.lokasi,
      type: newJob.tipe,
      category: newJob.kategori,
      skills: newJob.skill ? newJob.skill.split(',').map(s => s.trim()) : [],
      hours: newJob.jam_kerja,
      minAge: newJob.minimal_umur,
      salary: newJob.gaji,
      description: newJob.deskripsi,
      contactEmail: newJob.email_kontak,
      contactPhone: newJob.whatsapp,
      image: newJob.foto,
      createdAt: newJob.created_at,
    };

    res.status(201).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  try {
    const {
      title, company, location, type, category, skills,
      hours, minAge, salary, description, contactEmail, contactPhone, image
    } = req.body;

    const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;

    db.prepare(`
      UPDATE lowongan SET
        judul = ?, perusahaan = ?, lokasi = ?, tipe = ?, kategori = ?,
        skill = ?, jam_kerja = ?, minimal_umur = ?, gaji = ?, deskripsi = ?,
        email_kontak = ?, whatsapp = ?, foto = ?
      WHERE id = ?
    `).run(title, company, location, type, category, skillsStr, hours || '', minAge || 18, salary, description || '', contactEmail || '', contactPhone || '', image || '', req.params.id);

    const updatedJob = db.prepare('SELECT * FROM lowongan WHERE id = ?').get(req.params.id);
    const parsed = {
      id: updatedJob.id,
      title: updatedJob.judul,
      company: updatedJob.perusahaan,
      location: updatedJob.lokasi,
      type: updatedJob.tipe,
      category: updatedJob.kategori,
      skills: updatedJob.skill ? updatedJob.skill.split(',').map(s => s.trim()) : [],
      hours: updatedJob.jam_kerja,
      minAge: updatedJob.minimal_umur,
      salary: updatedJob.gaji,
      description: updatedJob.deskripsi,
      contactEmail: updatedJob.email_kontak,
      contactPhone: updatedJob.whatsapp,
      image: updatedJob.foto,
      createdAt: updatedJob.created_at,
    };

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM lowongan WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Lowongan tidak ditemukan' });
    }
    res.json({ message: 'Lowongan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SkillShift API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: skillshift.db (schema baru)`);
  console.log(`📋 Tabel: lowongan, mahasiswa, riwayat_accepted\n`);
});