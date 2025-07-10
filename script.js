document.addEventListener('DOMContentLoaded', () => {
    const nikInput = document.getElementById('nikInput');
    const searchButton = document.getElementById('searchButton');
    const resultDiv = document.getElementById('result');
    const noDataMessage = document.getElementById('noDataMessage');

    let santriData = [];

    // Mengambil data santri dari file JSON
    fetch('data_santri.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            santriData = data;
            console.log("Data santri berhasil dimuat:", santriData);
        })
        .catch(error => {
            console.error("Gagal memuat data santri:", error);
            resultDiv.innerHTML = '<p class="no-data-message">Gagal memuat data santri. Silakan coba lagi nanti.</p>';
        });

    searchButton.addEventListener('click', () => {
        performSearch();
    });

    nikInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const nikToSearch = nikInput.value.trim();
        resultDiv.innerHTML = ''; // Kosongkan hasil sebelumnya
        noDataMessage.style.display = 'none'; // Sembunyikan pesan "tidak ditemukan"

        if (nikToSearch === '') {
            resultDiv.innerHTML = '<p class="no-data-message">Mohon masukkan NIK yang ingin dicari.</p>';
            return;
        }

        const foundSantri = santriData.find(santri => santri.NIK === nikToSearch);

        if (foundSantri) {
            displaySantriData(foundSantri);
        } else {
            noDataMessage.style.display = 'block';
        }
    }

    function displaySantriData(santri) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-label">Nama Santri</div>
                <div class="result-value">: ${santri.nama}</div>
            </div>
            <div class="result-item">
                <div class="result-label">NIK</div>
                <div class="result-value">: ${santri.NIK}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Jenis Kelamin</div>
                <div class="result-value">: ${santri.jenis_kelamin}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Tempat, Tgl Lahir</div>
                <div class="result-value">: ${santri.tempat_tanggal_lahir}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Alamat</div>
                <div class="result-value">: ${santri.alamat}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Nama Ayah</div>
                <div class="result-value">: ${santri.nama_ayah}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Nama Ibu</div>
                <div class="result-value">: ${santri.nama_ibu}</div>
            </div>
            <div class="result-item">
                <div class="result-label">Nomor HP</div>
                <div class="result-value">: ${santri.nomor_hp}</div>
            </div>
        `;
    }
});
