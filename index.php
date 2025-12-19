<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <title>Healthyfy | BMI Health Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

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

    <div class="row">
      <div class="col-12 col-lg-4">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title m-0">Data Pengguna</h6>
          </div>
          <div class="card-body p-0">
            <form>
              <div class="row p-3">
                <div class="col-12 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Usia</label>
                    <input class="form-control" placeholder="00" id="age" type="number">
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Jenis Kelamin</label>
                    <select class="form-select form-control form-control-sm" id="gender">
                      <option value="">-- Pilih P/L --</option>
                      <option value="male">Pria</option>
                      <option value="female">Wanita</option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Berat <code>(kg)</code></label>
                    <input class="form-control" placeholder="00" id="weight" type="number">
                  </div>
                </div>
                <div class="col-12 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Tinggi <code>(cm)</code></label>
                    <input class="form-control" placeholder="00" id="height" type="number">
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button class="btn btn-block btn-primary w-100" type="submit">
                  <i class="fa-solid fa-calculator"></i>
                  <span>Hitung BMI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card">
          <h2>Hasil BMI</h2>
          <div class="hasil">
            <h3 id="nilaiBMI">0</h3>
            <span id="kategoriBMI">-</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card">
          <h2>Grafik Kategori BMI</h2>
          <canvas id="bmiChart"></canvas>
        </div>
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

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>
  <script src="script.js?ver=<?= date('ymdhis') ?>"></script>
</body>

</html>