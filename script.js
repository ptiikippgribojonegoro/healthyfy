let bmiChart;

/* ======================
   HITUNG BMI
====================== */
function calBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

/* ======================
   KATEGORI BMI
====================== */
function getCategoryBMI(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesitas";
}

/* ======================
   WARNA KATEGORI
====================== */
function categoryColor(category) {
  switch (category) {
    case "underweight":
      return "primary";
    case "normal":
      return "success";
    case "overweight":
      return "warning";
    case "obesitas":
      return "danger";
    default:
      return "secondary";
  }
}

function bmiDescription(category) {
  const data = {
    underweight: {
      icon: "🟦",
      text: "Berat badan Anda berada di bawah rentang ideal.",
      range: "< 18.5",
    },
    normal: {
      icon: "🟢",
      text: "Berat badan Anda berada dalam rentang ideal.",
      range: "18.5 – 24.9",
    },
    overweight: {
      icon: "🟡",
      text: "Berat badan Anda sedikit di atas rentang ideal.",
      range: "25 – 29.9",
    },
    obesitas: {
      icon: "🔴",
      text: "Berat badan Anda jauh di atas rentang ideal.",
      range: "≥ 30",
    },
  };
  return data[category];
}

/* ======================
   SUBMIT FORM
====================== */
function postBMI(e) {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  // VALIDASI
  if (!age || !weight || !height || height <= 0 || weight <= 0) {
    alert("Mohon isi data dengan benar");
    return;
  }

  const bmi = calBMI(weight, height);
  const category = getCategoryBMI(bmi);
  const color = categoryColor(category);

  const desc = bmiDescription(category);

  document.getElementById("bmiReport").innerHTML = `
  <div class="mb-2">
    <h1 id="bmiValue">${bmi}</h1>
  </div>

  <h3>
    <span id="bmiCategory" class="badge badge-light text-${color} text-uppercase">
      ${desc.icon} ${category}
    </span>
  </h3>

  <p class="mt-2 mb-0">
    ${desc.text}
  </p>

  <small class="text-gray">
    Rentang kategori: <b>${desc.range}</b>
  </small>
  <div class="px-1 mt-3">
    <div class="info-note mb-2 bg-white">
      <span class="info-icon">🧮</span>
      <span class="info-text text-start">Hasil BMI ini bertujuan memberikan gambaran umum mengenai kondisi berat badan berdasarkan data yang Anda masukkan dan menggunakan standar BMI dewasa (usia 18 tahun ke atas). Informasi ini bersifat informatif dan tidak dapat digunakan sebagai pengganti pemeriksaan, diagnosis, atau saran medis dari tenaga kesehatan profesional.</span>
    </div>
  </div>
`;

  document.getElementById("placeholderBmiReport").classList.add("d-none");
  document.getElementById("bmiReport").classList.remove("d-none");
  document.getElementById("placeholderBmiChart").classList.add("d-none");
  document.getElementById("bmiChartWrapper").classList.remove("d-none");
  document
    .getElementById("placeholderBmiRecomendation")
    .classList.add("d-none");
  document.getElementById("contentRecomendation").classList.remove("d-none");

  chartBMI(bmi, category);
  renderRecommendation(height, weight, age, gender, category);
}

/* ======================
   PIE CHART BMI
====================== */

const bmiRanges = {
  underweight: { min: 0, max: 18.5 },
  normal: { min: 18.5, max: 24.9 },
  overweight: { min: 24.9, max: 29.9 },
  obesitas: { min: 29.9, max: 40 },
};

function generatePieDataByBMI(bmi, category) {
  const weights = {
    underweight: 5,
    normal: 5,
    overweight: 5,
    obesitas: 5,
  };

  const active = bmiRanges[category];
  const rangeSize = active.max - active.min;

  // posisi BMI dalam kategorinya (0–1)
  const position = Math.min(Math.max((bmi - active.min) / rangeSize, 0), 1);

  // bobot kategori utama
  weights[category] = 60;

  // kategori sebelum & sesudah
  const keys = Object.keys(bmiRanges);
  const index = keys.indexOf(category);

  if (index > 0) {
    weights[keys[index - 1]] += (1 - position) * 25;
  }

  if (index < keys.length - 1) {
    weights[keys[index + 1]] += position * 25;
  }

  // normalisasi ke 100
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach(
    (k) => (weights[k] = +((weights[k] / total) * 100).toFixed(1))
  );

  return weights;
}

function chartBMI(bmi, category) {
  const ctx = document.getElementById("bmiChart");

  const datasetCategory = generatePieDataByBMI(Number(bmi), category);

  const rawLabels = Object.keys(datasetCategory);

  const labels = rawLabels.map((l) => l.charAt(0).toUpperCase() + l.slice(1));
  const values = Object.values(datasetCategory);

  const colors = {
    underweight: "#90CAF9",
    normal: "#A5D6A7",
    overweight: "#FFE082",
    obesitas: "#EF9A9A",
  };

  if (bmiChart) bmiChart.destroy();

  bmiChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: rawLabels.map((l) => colors[l]),
          borderWidth: rawLabels.map((l) => (l === category ? 4 : 1)),
          borderColor: rawLabels.map((l) =>
            l === category ? "#2E7D32" : "#ffffff"
          ),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (ctx) {
              return ` ${ctx.parsed}%`;
            },
          },
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
        datalabels: {
          color: "#333",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value) => `${value}%`,
        },
      },
    },

    plugins: [ChartDataLabels],
  });
}

function idealWeightHeight(heightCm, weightKg, age, gender) {
  const heightM = heightCm / 100;

  let bmiMin = 18.5;
  let bmiMax = 24.9;

  // Adjust usia
  let weightTolerance = 0;
  if (age > 40) weightTolerance += 1.5;

  // Adjust gender
  if (gender === "male") weightTolerance += 1;

  // Berat ideal dari tinggi
  let minWeight = bmiMin * (heightM * heightM);
  let maxWeight = bmiMax * (heightM * heightM);

  minWeight = (minWeight - weightTolerance).toFixed(1);
  maxWeight = (maxWeight + weightTolerance).toFixed(1);

  // Tinggi ideal dari berat
  let minHeight = Math.sqrt(weightKg / bmiMax) * 100;
  let maxHeight = Math.sqrt(weightKg / bmiMin) * 100;

  return {
    weightRange: `${minWeight} – ${maxWeight} kg`,
    heightRange: `${minHeight.toFixed(0)} – ${maxHeight.toFixed(0)} cm`,
    note:
      age < 18
        ? "Catatan: Untuk usia di bawah 18 tahun, hasil perhitungan ini bersifat indikatif karena masih menggunakan standar BMI dewasa. Pada usia anak dan remaja, pertumbuhan tubuh masih berlangsung sehingga penilaian status berat badan sebaiknya dilakukan menggunakan standar khusus dan dikonsultasikan dengan tenaga kesehatan profesional."
        : null,
  };
}

function lifestyleRecommendation(category) {
  const data = {
    underweight: {
      activity: [
        {
          title: "Latihan Kekuatan Ringan",
          tips: [
            "Lakukan latihan beban ringan 2–3 kali per minggu",
            "Fokus pada gerakan dasar seperti squat, push-up, dan plank",
            "Tingkatkan beban secara bertahap sesuai kemampuan tubuh",
          ],
        },
        {
          title: "Aktivitas Fisik Harian",
          tips: [
            "Tetap aktif dengan berjalan kaki atau peregangan ringan",
            "Hindari aktivitas fisik berlebihan yang membakar terlalu banyak kalori",
            "Utamakan aktivitas yang membangun kekuatan, bukan hanya cardio",
          ],
        },
        {
          title: "Pemulihan Tubuh",
          tips: [
            "Berikan waktu istirahat yang cukup setelah berolahraga",
            "Hindari olahraga berat setiap hari tanpa jeda",
            "Dengarkan sinyal lelah dari tubuh",
          ],
        },
      ],
      diet: [
        {
          title: "Peningkatan Asupan Kalori Sehat",
          tips: [
            "Tambahkan porsi makan secara bertahap",
            "Pilih makanan padat nutrisi, bukan sekadar tinggi kalori",
            "Hindari mengganti makan utama dengan camilan saja",
          ],
        },
        {
          title: "Asupan Protein",
          tips: [
            "Konsumsi protein dari telur, ikan, ayam, tahu, atau tempe",
            "Sertakan protein di setiap waktu makan",
            "Protein membantu pembentukan massa otot",
          ],
        },
        {
          title: "Pola Makan Teratur",
          tips: [
            "Makan 3 kali sehari dengan camilan sehat di antaranya",
            "Jangan melewatkan sarapan",
            "Buat jadwal makan yang konsisten",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Kualitas Tidur",
          tips: [
            "Tidur 7–9 jam setiap malam",
            "Tidur dan bangun di jam yang sama setiap hari",
            "Hindari begadang yang tidak perlu",
          ],
        },
        {
          title: "Manajemen Stres",
          tips: [
            "Kelola stres dengan aktivitas relaksasi",
            "Hindari tekanan berlebih pada tubuh",
            "Luangkan waktu untuk istirahat mental",
          ],
        },
      ],
    },

    normal: {
      activity: [
        {
          title: "Olahraga Seimbang",
          tips: [
            "Kombinasikan latihan kekuatan dan cardio",
            "Berolahraga 3–4 kali per minggu",
            "Variasikan jenis olahraga agar tidak bosan",
          ],
        },
        {
          title: "Aktivitas Harian Aktif",
          tips: [
            "Kurangi duduk terlalu lama",
            "Gunakan tangga dibanding lift",
            "Tetap bergerak di sela aktivitas",
          ],
        },
        {
          title: "Pencegahan Cedera",
          tips: [
            "Lakukan pemanasan sebelum olahraga",
            "Pendinginan setelah latihan",
            "Gunakan teknik yang benar",
          ],
        },
      ],
      diet: [
        {
          title: "Pola Makan Seimbang",
          tips: [
            "Penuhi karbohidrat, protein, lemak, vitamin, dan mineral",
            "Perbanyak sayur dan buah",
            "Batasi makanan tinggi gula dan lemak jenuh",
          ],
        },
        {
          title: "Kontrol Porsi",
          tips: [
            "Makan secukupnya sesuai kebutuhan",
            "Hindari makan berlebihan meski makanan sehat",
            "Perhatikan rasa kenyang",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Menjaga Konsistensi",
          tips: [
            "Pertahankan kebiasaan sehat yang sudah baik",
            "Jangan lengah meski berat badan normal",
            "Pantau berat badan secara berkala",
          ],
        },
      ],
    },

    overweight: {
      activity: [
        {
          title: "Cardio Intensitas Sedang",
          tips: [
            "Lakukan jalan cepat, bersepeda, atau berenang",
            "Durasi minimal 30 menit per hari",
            "Lakukan secara konsisten",
          ],
        },
        {
          title: "Latihan Kekuatan",
          tips: [
            "Latihan otot 2–3 kali per minggu",
            "Gunakan berat tubuh sebagai awal",
            "Latihan membantu meningkatkan metabolisme",
          ],
        },
        {
          title: "Aktivitas Fisik Bertahap",
          tips: [
            "Mulai dari intensitas ringan",
            "Tingkatkan perlahan sesuai kemampuan",
            "Hindari olahraga ekstrem mendadak",
          ],
        },
      ],
      diet: [
        {
          title: "Pengaturan Asupan Kalori",
          tips: [
            "Kurangi makanan tinggi gula dan lemak",
            "Batasi minuman manis",
            "Perhatikan ukuran porsi",
          ],
        },
        {
          title: "Peningkatan Serat",
          tips: [
            "Perbanyak sayur, buah, dan biji-bijian",
            "Serat membantu rasa kenyang lebih lama",
            "Baik untuk pencernaan",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Perubahan Kebiasaan",
          tips: [
            "Atur jam makan secara teratur",
            "Kurangi kebiasaan ngemil malam",
            "Tidur cukup dan berkualitas",
          ],
        },
      ],
    },

    obesitas: {
      activity: [
        {
          title: "Aktivitas Fisik Aman",
          tips: [
            "Mulai dengan jalan kaki atau berenang",
            "Pilih aktivitas low-impact",
            "Hindari olahraga yang memberi tekanan berlebih pada sendi",
          ],
        },
        {
          title: "Peningkatan Bertahap",
          tips: [
            "Tambah durasi dan intensitas secara perlahan",
            "Fokus pada konsistensi, bukan kecepatan hasil",
            "Jangan memaksakan diri",
          ],
        },
      ],
      diet: [
        {
          title: "Pengurangan Kalori Sehat",
          tips: [
            "Kurangi makanan tinggi kalori dan rendah nutrisi",
            "Utamakan makanan segar dan alami",
            "Hindari diet ekstrem",
          ],
        },
        {
          title: "Pendampingan Profesional",
          tips: [
            "Pertimbangkan konsultasi dengan tenaga kesehatan",
            "Ikuti rencana makan yang aman",
            "Pantau progres secara berkala",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Pembentukan Kebiasaan Sehat",
          tips: [
            "Mulai dari perubahan kecil",
            "Tetapkan target yang realistis",
            "Bangun rutinitas yang bisa dipertahankan jangka panjang",
          ],
        },
      ],
    },
  };

  return data[category];
}

function renderRecommendation(height, weight, age, gender, category) {
  const ideal = idealWeightHeight(height, weight, age, gender);
  const life = lifestyleRecommendation(category);

  const items = document.querySelectorAll(".recomendation-item");

  // Ideal Berat/Tinggi
  items[0].innerHTML = `
    ✓ Berat ideal Anda: <b>${ideal.weightRange}</b><br/>
    ✓ Tinggi ideal dari berat saat ini: <b>${ideal.heightRange}</b>
    ${
      ideal.note
        ? `<p class="m-0 mt-2"><small class="text-danger">${ideal.note}</small></p>`
        : ""
    }
  `;

  // Aktivitas
  items[1].innerHTML = renderLifeSection(life.activity);

  // Pola makan
  items[2].innerHTML = renderLifeSection(life.diet);

  // Gaya hidup
  items[3].innerHTML = renderLifeSection(life.lifestyle);
}

function renderLifeSection(section) {
  return section
    .map(
      (item) => `
    <div class="mb-3">
      <strong>${item.title}</strong>
      <ul class="mb-0 ps-3">
        ${item.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
}
