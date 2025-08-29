### 🌟 Tujuan Fitur: Credits Usage

Memberikan transparansi kepada user terkait konsumsi kredit yang digunakan untuk berbagai aktivitas AI seperti:

* Chat (message)
* Autogenerate judul (title)
* Summary, dll

User bisa melihat riwayat detail: kapan digunakan, untuk apa, model apa, dan berapa kredit terpotong.

---

### 🧱 Struktur Data MongoDB (Contoh Dokumen)

```json
{
  "_id": { "$oid": "66346fe35ee99d0b7a63db62" },
  "createdAt": { "$date": "2025-05-03T07:37:00.647Z" },
  "context": "message",           // Jenis aksi: message, title, summary, dsb
  "model": "gpt-4o-mini",         // Nama model AI yang digunakan
  "tokenType": "completion",      // prompt / completion
  "tokenValue": -196.2,           // Token yang terpakai (dalam float)
  "rate": 0.6,                    // Biaya per 1k token (bisa beda tiap model/tokenType)
  "rawAmount": -327               // Kredit yang dipotong (integer, dihitung dari rate x token)
}
```

---

### 💥 Tampilan Frontend (Table UI)

| Waktu            | Model       | Context | Jenis Token | Token Used | Rate | Credit Terpotong |
| ---------------- | ----------- | ------- | ----------- | ---------- | ---- | ---------------- |
| 3 Mei 2025 14:37 | gpt-4o-mini | message | completion  | 196.20     | 0.60 | -327             |
| 3 Mei 2025 14:37 | gpt-4o-mini | message | prompt      | 56.25      | 0.15 | -375             |
| 3 Mei 2025 14:07 | gpt-4o      | title   | prompt      | 350.00     | 2.50 | -140             |
| ...              | ...         | ...     | ...         | ...        | ...  | ...              |

#### Summary (di atas tabel):

* Total Credit Terpakai: `-X`
* Range waktu: filter by day/week/month
* Breakdown by model: pie chart opsional
* Export CSV: tombol download

---

### 🔧 Backend Logika (Express.js + MongoDB)

#### Endpoint:

```http
GET /api/credits/usage
```

#### Query Parameters:

* `startDate`: ISO string
* `endDate`: ISO string
* `model`: optional
* `context`: optional
* `tokenType`: optional

#### Response:

```json
[
  {
    "createdAt": "2025-05-03T07:37:00.647Z",
    "context": "message",
    "model": "gpt-4o-mini",
    "tokenType": "completion",
    "tokenValue": -196.2,
    "rate": 0.6,
    "rawAmount": -327
  },
  ...
]
```

---

### 🛆 Perhitungan Credit

```ts
// credit = ceil(tokenValue * rate)
const credit = Math.ceil(Math.abs(tokenValue) * rate)
```

---

### 📊 Fitur Tambahan (Opsional)

* Aggregasi per minggu/bulan (`$group`)
* Estimasi pemakaian harian rata-rata
* Prediksi kapan kredit habis
* Alert jika penggunaan > threshold tertentu

---

### 💡 UX Tips

* Gunakan format waktu lokal + zona (misal: WIB)
* Gunakan warna merah untuk pengurangan kredit
* Tambahkan tooltip untuk istilah teknis (token, rate, dsb)
