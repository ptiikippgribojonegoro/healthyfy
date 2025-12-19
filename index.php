<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <title>Healthyfy | BMI Health Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <link rel="stylesheet" href="style.css?ver=<?= date('ymdhis') ?>" />
</head>

<body>
  <div class="container">
    <header>
      <img src="logo.png" alt="Healthyfy Logo" class="logo" />
      <h1>Healthyfy</h1>
      <p>Smart BMI & Healthy Lifestyle Recommendation</p>
    </header>

    <!-- HASIL & GRAFIK -->
    <div class="grid">
      <!-- INPUT DATA -->
      <div class="card">
        <h2>Data Pengguna</h2>

        <label>Usia</label>
        <input type="number" id="usia" placeholder="Contoh: 20" />

        <label>Gender</label>
        <select id="gender">
          <option value="">-- Pilih Gender --</option>
          <option value="pria">Pria</option>
          <option value="wanita">Wanita</option>
        </select>

        <label>Berat Badan (kg)</label>
        <input type="number" id="berat" placeholder="Contoh: 65" />

        <label>Tinggi Badan (cm)</label>
        <input type="number" id="tinggi" placeholder="Contoh: 170" />

        <button onclick="hitungBMI()">
          <i class="fa-solid fa-calculator"></i>
          Hitung BMI
        </button>
      </div>
      <div class="card">
        <h2>Hasil BMI</h2>
        <div class="hasil">
          <h3 id="nilaiBMI">0</h3>
          <span id="kategoriBMI">-</span>
        </div>
      </div>

      <div class="card">
        <h2>Grafik Kategori BMI</h2>
        <canvas id="bmiChart"></canvas>
      </div>
    </div>

    <!-- REKOMENDASI -->
    <div class="card rekomendasi">
      <h2>
        <i class="fa-solid fa-heart-circle-check"></i>
        Rekomendasi Personal
      </h2>

      <h3>🏃 Aktivitas Fisik</h3>
      <ul id="aktivitas"></ul>

      <h3>🥗 Pola Makan</h3>
      <ul id="makanan"></ul>

      <h3>🌿 Tips Gaya Hidup</h3>
      <ul id="gayahidup"></ul>
    </div>

    <footer>© 2025 Healthyfy</footer>
  </div>

  <script src="script.js?ver=<?= date('ymdhis') ?>"></script>
</body>

</html>