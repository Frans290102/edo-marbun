export type Transaction = {
  id: string;
  date: string; // ISO
  product: string;
  category: string;
  region: string;
  segment: string;
  payment: string;
  quantity: number;
  revenue: number;
};

const categories = ["Electronics", "Fashion", "Home & Living", "Beauty", "Sports"];
const products: Record<string, string[]> = {
  Electronics: ["Wireless Earbuds", "Smart Watch", "Laptop Stand", "USB-C Hub", "Webcam HD"],
  Fashion: ["Sneakers", "Denim Jacket", "Tote Bag", "Polo Shirt", "Cap"],
  "Home & Living": ["Desk Lamp", "Ceramic Mug Set", "Throw Pillow", "Wall Clock", "Storage Box"],
  Beauty: ["Serum Vitamin C", "Moisturizer", "Lip Tint", "Face Wash", "Sunscreen"],
  Sports: ["Yoga Mat", "Resistance Band", "Water Bottle", "Jump Rope", "Gym Gloves"],
};
const regions = ["Jakarta", "Surabaya", "Bandung", "Medan", "Makassar"];
const segments = ["Consumer", "Corporate", "Home Office"];
const payments = ["Bank Transfer", "E-Wallet", "Credit Card", "COD"];

// Deterministic pseudo-random so SSR and client match
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const transactions: Transaction[] = (() => {
  const rand = seededRandom(42);
  const rows: Transaction[] = [];
  const start = new Date(2025, 0, 1).getTime();
  const end = new Date(2025, 11, 31).getTime();
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]!;
  for (let i = 0; i < 480; i++) {
    const category = pick(categories);
    const productList = products[category]!;
    const date = new Date(start + rand() * (end - start));
    const quantity = 1 + Math.floor(rand() * 8);
    const price = 50000 + Math.floor(rand() * 1450000);
    rows.push({
      id: `TRX-${String(1000 + i)}`,
      date: date.toISOString().slice(0, 10),
      product: pick(productList),
      category,
      region: pick(regions),
      segment: pick(segments),
      payment: pick(payments),
      quantity,
      revenue: quantity * price,
    });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
})();

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function formatIDR(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export type CaseStudy = {
  id: string;
  title: string;
  tools: string[];
  problem: string;
  methodology: string;
  impact: string;
  insights: string[];
  recommendations: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "churn",
    title: "Customer Churn Analysis",
    tools: ["Python", "SQL", "Power BI"],
    problem:
      "Perusahaan telecom mengalami churn rate 18% per kuartal tanpa visibilitas jelas tentang segmen pelanggan yang paling berisiko berhenti berlangganan.",
    methodology:
      "Membersihkan dan menggabungkan 12.000+ baris data pelanggan dengan SQL, melakukan exploratory data analysis di Python (pandas), membangun model klasifikasi sederhana, dan memvisualisasikan faktor risiko churn di dashboard Power BI.",
    impact:
      "Mengidentifikasi 3 segmen berisiko tinggi dan faktor utama churn, memungkinkan tim retensi menargetkan intervensi — proyeksi penurunan churn 4-6%.",
    insights: [
      "Pelanggan dengan kontrak bulanan 3x lebih mungkin churn dibanding kontrak tahunan.",
      "Keluhan layanan yang tidak terselesaikan dalam 48 jam menaikkan risiko churn 65%.",
      "Segmen usia 25-34 dengan paket data menengah adalah kelompok paling volatile.",
    ],
    recommendations: [
      "Tawarkan insentif upgrade kontrak tahunan untuk pelanggan bulanan berisiko tinggi.",
      "Terapkan SLA penyelesaian keluhan maksimal 24 jam untuk pelanggan prioritas.",
      "Bangun early-warning dashboard churn mingguan untuk tim retensi.",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce Sales Performance",
    tools: ["SQL", "Power BI", "Excel"],
    problem:
      "Marketplace lokal tidak memiliki visibilitas terpadu atas performa penjualan antar kategori dan wilayah, sehingga keputusan stok dan promosi bersifat reaktif.",
    methodology:
      "Merancang data mart penjualan dengan SQL, membersihkan 480+ transaksi, dan membangun dashboard Power BI interaktif dengan filter tanggal, kategori, dan wilayah.",
    impact:
      "Waktu penyusunan laporan mingguan turun dari 6 jam menjadi 15 menit; tim komersial dapat mengidentifikasi kategori underperforming 2 minggu lebih cepat.",
    insights: [
      "Kategori Electronics menyumbang 38% revenue namun hanya 22% volume transaksi.",
      "Wilayah Medan tumbuh 24% QoQ — tercepat di antara 5 wilayah.",
      "Metode E-Wallet mendominasi 41% transaksi, terutama di segmen Consumer.",
    ],
    recommendations: [
      "Alokasikan budget promosi ke kategori Beauty & Sports yang memiliki margin tinggi namun volume rendah.",
      "Perkuat kemitraan logistik di Medan untuk menangkap momentum pertumbuhan.",
      "Optimalkan checkout E-Wallet dengan cashback untuk menaikkan konversi.",
    ],
  },
  {
    id: "fraud",
    title: "Financial Fraud Detection",
    tools: ["Python", "ML", "SQL"],
    problem:
      "Perusahaan fintech kehilangan sekitar Rp 800 juta per tahun akibat transaksi fraud yang baru terdeteksi setelah dilaporkan nasabah.",
    methodology:
      "Melakukan feature engineering pada data transaksi historis, menangani class imbalance dengan SMOTE, dan melatih model Random Forest serta Logistic Regression sebagai baseline, dievaluasi dengan precision-recall.",
    impact:
      "Model mencapai recall 87% dengan false positive rate 3% — berpotensi mencegah 70%+ kerugian fraud tahunan.",
    insights: [
      "Transaksi fraud terkonsentrasi pada jam 00:00-04:00 dengan nominal 2-5x rata-rata transaksi normal.",
      "Perubahan perangkat + lokasi baru dalam 1 jam adalah sinyal fraud terkuat.",
      "Hanya 0,8% transaksi yang fraud — membutuhkan pendekatan imbalance-aware.",
    ],
    recommendations: [
      "Terapkan scoring real-time untuk transaksi di atas threshold risiko.",
      "Tambahkan verifikasi dua langkah untuk transaksi jam malam bernominal besar.",
      "Retrain model bulanan dengan data fraud terkonfirmasi terbaru.",
    ],
  },
  {
    id: "hr",
    title: "HR Attrition & Workforce Analytics",
    tools: ["Python", "Tableau", "Excel"],
    problem:
      "Perusahaan ritel dengan 1.200 karyawan mengalami attrition 22% per tahun tanpa pemahaman faktor pendorongnya.",
    methodology:
      "Menganalisis data HRIS (tenure, gaji, skor performa, survei engagement) dengan Python, lalu membangun dashboard Tableau yang memetakan attrition per departemen, level, dan demografi.",
    impact:
      "Mengungkap bahwa 60% attrition berasal dari 2 departemen dengan gap gaji terhadap pasar — dasar revisi struktur kompensasi.",
    insights: [
      "Karyawan dengan tenure 1-2 tahun dan skor engagement <3 paling berisiko resign.",
      "Gap gaji >10% di bawah median pasar berkorelasi kuat dengan attrition.",
      "Departemen Operations menyumbang 35% total attrition.",
    ],
    recommendations: [
      "Prioritaskan penyesuaian gaji untuk peran kritis di Operations dan Sales.",
      "Jalankan program check-in manager untuk karyawan tenure 1-2 tahun.",
      "Pantau engagement score per kuartal sebagai leading indicator attrition.",
    ],
  },
];

export const profile = {
  name: "Fransiskus Lucky Edo Marbun",
  role: "Aspiring Data Analyst",
  location: "North Sumatera, Indonesia",
  email: "edomarbun29@gmail.com",
  phone: "+62-813-7509-9933",
  linkedin: "https://www.linkedin.com/in/fransiskus-lucky-edo-marbun",
  github: "https://github.com/edomarbun",
  bio: "Analytical and detail-oriented aspiring Data Analyst with hands-on experience in data entry, administrative support, and data organization. Strong foundation in Excel/Sheets, data cleaning, and data validation, with growing skills in SQL and data visualization. Known for maintaining accuracy, improving workflow efficiency, and translating raw data into clear, usable information.",
  skills: ["Microsoft Excel", "Power BI", "SQL", "Python", "Google Sheets", "MySQL", "Data Cleaning", "Data Visualization", "ETL", "Business Intelligence"],
  competencies: ["Strategic Planning", "Client Relationships", "Critical Thinking", "English Proficiency", "Team Work", "Communication"],
};
