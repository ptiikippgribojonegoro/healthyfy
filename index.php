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

  <link rel="stylesheet" href="style.css?ver=<?= date('ymdhis') ?>" />
</head>

<body>
  <div class="container">
    <header class="py-3">
      <img src="logo.png" alt="Healthyfy Logo" class="logo mb-2" />
      <h1>Healthyfy</h1>
      <p>Smart BMI & Healthy Lifestyle Recommendation</p>
    </header>

    <div class="row">
      <div class="col-12 col-lg-4 mb-2">
        <div class="card">
          <div class="card-header">
            <h6 class="card-title m-0">Data Pengguna</h6>
          </div>
          <div class="card-body p-0">
            <form onsubmit="postBMI(event)">
              <div class="row p-3">
                <div class="col-6 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Usia</label>
                    <input class="form-control" required placeholder="00" id="age" type="number">
                  </div>
                </div>
                <div class="col-6 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Jenis Kelamin</label>
                    <select required class="form-select form-control form-control-sm" id="gender">
                      <option value="">-- Pilih P/L --</option>
                      <option value="male">Laki-Laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>
                <div class="col-6 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Berat <code>(kg)</code></label>
                    <input required class="form-control" placeholder="00" id="weight" type="number">
                  </div>
                </div>
                <div class="col-6 col-lg-6">
                  <div class="form-group mb-2">
                    <label class="form-label mb-1 sm">Tinggi <code>(cm)</code></label>
                    <input required class="form-control" placeholder="00" id="height" type="number">
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
      <div class="col-12 col-lg-4 mb-2">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="card-title m-0">Hasil BMI</h6>
          </div>
          <div class="card-body p-0 d-flex align-items-center justify-content-center">
            <div id="placeholderBmiReport" class="resultPlaceholder text-center">
              <div class="icon">🧮</div>
              <p class="text-muted">
                Hasil perhitungan BMI akan tampil di sini
              </p>
            </div>
            <div id="bmiReport" class="text-center d-none"></div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 mb-2">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="card-title m-0">Grafil BMI</h6>
          </div>
          <div class="card-body p-0 d-flex align-items-center justify-content-center">
            <div id="placeholderBmiChart" class="resultPlaceholder text-center">
              <div class="icon">📊</div>
              <p class="text-muted">
                Grafik perhitungan BMI akan tampil di sini
              </p>
            </div>
            <div id="bmiChartWrapper" class="chart-wrapper d-none">
              <canvas id="bmiChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-12 mb-2 mt-3">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title m-0"><i class="fa-solid fa-heart-circle-check text-danger"></i><span
                class="ms-2">Rekomendasi
                Personal</span></h5>
          </div>
          <div class="card-body">
            <div class="recomendation-item border-bottom pb-2 mb-3">
              <h6>🎯 Berat & Tinggi Ideal</h6>
              <p></p>
            </div>
            <div class="recomendation-item border-bottom pb-2 mb-3">
              <h6>🏃 Aktivitas Fisik</h6>
              <p></p>
            </div>
            <div class="recomendation-item border-bottom pb-2 mb-3">
              <h6>🥗 Pola Makan</h6>
              <p></p>
            </div>
            <div class="recomendation-item pb-2">
              <h6>🌿 Tips Gaya Hidup</h6>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="pb-3">
      <div class="text-center">
        <p class="m-0">© <?= date('Y') ?> Healthyfy</p>
        <p class="m-0">Pendidikan Teknologi Informasi</p>
        <p class="m-0">IKIP PGRI Bojonegoro</p>
      </div>
    </footer>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
  <script src="script.js?ver=<?= date('ymdhis') ?>"></script>
</body>

</html>