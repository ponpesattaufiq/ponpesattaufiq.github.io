document.addEventListener('DOMContentLoaded', () => {
    // === Bagian untuk Halaman Login (index.html) ===
    // Mengecek apakah berada di halaman index.html
    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');

    if (isIndexPage) {
        const loginForm = document.getElementById('loginForm');
        const nikInputSearch = document.getElementById('nikInput'); // Untuk bagian pencarian santri
        const searchButton = document.getElementById('searchButton'); // Untuk bagian pencarian santri
        const resultDiv = document.getElementById('result'); // Untuk bagian pencarian santri
        const noDataMessageDiv = document.getElementById('noDataMessage'); // Untuk bagian pencarian santri

        if (loginForm) {
            const loginMessage = document.getElementById('loginMessage');
            const loginButton = document.getElementById('loginButton');

            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                loginButton.disabled = true;
                loginButton.textContent = 'Memuat...';

                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();

                try {
                    const response = await fetch('users.json');
                    if (!response.ok) {
                        throw new Error(`Gagal memuat data pengguna: ${response.status}`);
                    }
                    const users = await response.json();

                    const user = users.find(u => u.username === username && u.password === password);

                    if (user) {
                        localStorage.setItem('loggedInNIK', user.NIK);
                        localStorage.setItem('loggedInUsername', user.username);
                        loginMessage.style.display = 'none';
                        window.location.href = 'dashboard.html';
                    } else {
                        loginMessage.textContent = 'Username atau Password salah.';
                        loginMessage.style.display = 'block';
                        loginButton.disabled = false;
                        loginButton.textContent = 'Login';
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    loginMessage.textContent = 'Terjadi kesalahan saat mencoba login. Silakan coba lagi.';
                    loginMessage.style.display = 'block';
                    loginButton.disabled = false;
                    loginButton.textContent = 'Login';
                }
            });
        }

        // Fungsionalitas pencarian santri di halaman utama (index.html)
        if (searchButton && nikInputSearch) {
            searchButton.addEventListener('click', async () => {
                const nikToSearch = nikInputSearch.value.trim();
                resultDiv.innerHTML = ''; // Kosongkan hasil sebelumnya
                noDataMessageDiv.style.display = 'none'; // Sembunyikan pesan 'tidak ditemukan'

                if (!nikToSearch) {
                    resultDiv.innerHTML = '<p class="no-data-info">Mohon masukkan NIK atau NISN untuk mencari.</p>';
                    return;
                }

                try {
                    const response = await fetch('data_santri.json');
                    if (!response.ok) {
                        throw new Error(`Gagal memuat data santri: ${response.status}`);
                    }
                    const santriData = await response.json();

                    const foundSantri = santriData.find(santri => santri.NIK === nikToSearch);

                    if (foundSantri) {
                        let html = `
                            <div class="result-item"><div class="result-label">Nama</div><div class="result-value">: ${foundSantri.nama}</div></div>
                            <div class="result-item"><div class="result-label">NIK</div><div class="result-value">: ${foundSantri.NIK}</div></div>
                            <div class="result-item"><div class="result-label">Jenis Kelamin</div><div class="result-value">: ${foundSantri.jenis_kelamin}</div></div>
                            <div class="result-item"><div class="result-label">Tempat, Tgl Lahir</div><div class="result-value">: ${foundSantri.tempat_tanggal_lahir}</div></div>
                            <div class="result-item"><div class="result-label">Alamat</div><div class="result-value">: ${foundSantri.alamat}</div></div>
                            <div class="result-item"><div class="result-label">Nama Ayah</div><div class="result-value">: ${foundSantri.nama_ayah}</div></div>
                            <div class="result-item"><div class="result-label">Nama Ibu</div><div class="result-value">: ${foundSantri.nama_ibu}</div></div>
                            <div class="result-item"><div class="result-label">Nomor HP</div><div class="result-value">: ${foundSantri.nomor_hp}</div></div>
                        `;
                        resultDiv.innerHTML = html;
                    } else {
                        noDataMessageDiv.style.display = 'block';
                    }
                } catch (error) {
                    console.error("Error memuat data santri:", error);
                    resultDiv.innerHTML = '<p class="error-message">Terjadi kesalahan saat memuat data santri. Silakan coba lagi nanti.</p>';
                }
            });
        }
    }


    // === Bagian untuk Halaman Dashboard (dashboard.html) ===
    if (window.location.pathname.endsWith('dashboard.html')) {
        const loggedInNIK = localStorage.getItem('loggedInNIK');
        const logoutButton = document.getElementById('logoutButton');

        if (!loggedInNIK) {
            window.location.href = 'index.html';
            return;
        }

        const santriInfoDiv = document.getElementById('santriInfo');
        const raportDataDiv = document.getElementById('raportData');
        const pelanggaranDataDiv = document.getElementById('pelanggaranData');
        const peringatanDataDiv = document.getElementById('peringatanData');
        const prestasiDataDiv = document.getElementById('prestasiData');
        const dataUnavailableMessage = document.getElementById('dataUnavailableMessage');
        const dashboardTitle = document.getElementById('dashboardTitle');

        if (logoutButton) {
            logoutButton.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('loggedInNIK');
                localStorage.removeItem('loggedInUsername');
                window.location.href = 'index.html';
            });
        }

        async function loadSantriData() {
            try {
                const response = await fetch('data_santri.json');
                if (!response.ok) {
                    throw new Error(`Gagal memuat data santri: ${response.status}`);
                }
                const santriData = await response.json();

                const foundSantri = santriData.find(santri => santri.NIK === loggedInNIK);

                if (foundSantri) {
                    dashboardTitle.textContent = `Data Santri: ${foundSantri.nama}`;
                    displaySantriInfo(foundSantri);
                    displayRaport(foundSantri.raport);
                    displayPelanggaran(foundSantri.pelanggaran);
                    displayPeringatan(foundSantri.peringatan);
                    displayPrestasi(foundSantri.prestasi);
                    dataUnavailableMessage.style.display = 'none';
                } else {
                    santriInfoDiv.innerHTML = '<p class="no-data-info">Data santri tidak ditemukan untuk NIK Anda.</p>';
                    dataUnavailableMessage.style.display = 'block';
                    raportDataDiv.innerHTML = '<p class="no-data-info">Data raport belum tersedia.</p>';
                    pelanggaranDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data pelanggaran.</p>';
                    peringatanDataDiv.innerHTML = '<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>';
                    prestasiDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data prestasi.</p>';
                }
            } catch (error) {
                console.error("Error memuat data santri:", error);
                santriInfoDiv.innerHTML = '<p class="error-message">Terjadi kesalahan saat memuat data santri. Silakan coba lagi nanti.</p>';
                dataUnavailableMessage.style.display = 'block';
            }
        }

        function displaySantriInfo(santri) {
            santriInfoDiv.innerHTML = `
                <div class="data-item"><div class="data-label">Nama Santri</div><div class="data-value">: ${santri.nama}</div></div>
                <div class="data-item"><div class="data-label">NIK</div><div class="data-value">: ${santri.NIK}</div></div>
                <div class="data-item"><div class="data-label">Jenis Kelamin</div><div class="data-value">: ${santri.jenis_kelamin}</div></div>
                <div class="data-item"><div class="data-label">Tempat, Tgl Lahir</div><div class="data-value">: ${santri.tempat_tanggal_lahir}</div></div>
                <div class="data-item"><div class="data-label">Alamat</div><div class="data-value">: ${santri.alamat}</div></div>
                <div class="data-item"><div class="data-label">Nama Ayah</div><div class="data-value">: ${santri.nama_ayah}</div></div>
                <div class="data-item"><div class="data-label">Nama Ibu</div><div class="data-value">: ${santri.nama_ibu}</div></div>
                <div class="data-item"><div class="data-label">Nomor HP</div><div class="data-value">: ${santri.nomor_hp}</div></div>
            `;
        }

        function displayRaport(raport) {
            if (raport && Object.keys(raport).length > 0) {
                let raportHtml = '<div class="raport-sections">';
                for (const semester in raport) {
                    raportHtml += `<div class="raport-section"><h3>${semester.replace(/_/g, ' ').toUpperCase()}</h3><ul>`;
                    for (const mataPelajaran in raport[semester]) {
                        raportHtml += `
                            <li class="data-item">
                                <div class="data-label">${mataPelajaran.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                                <div class="data-value">: ${raport[semester][mataPelajaran]}</div>
                            </li>`;
                    }
                    raportHtml += '</ul></div>';
                }
                raportHtml += '</div>';
                raportDataDiv.innerHTML = raportHtml;
            } else {
                raportDataDiv.innerHTML = '<p class="no-data-info">Data raport belum tersedia.</p>';
            }
        }

        function displayPelanggaran(pelanggaran) {
            if (pelanggaran && pelanggaran.length > 0) {
                let pelanggaranHtml = '<ul>';
                pelanggaran.forEach(p => {
                    pelanggaranHtml += `
                        <li>
                            <div class="data-item">
                                <div class="data-label">Tanggal</div><div class="data-value">: ${p.tanggal}</div>
                            </div>
                            <div class="data-item">
                                <div class="data-label">Jenis Pelanggaran</div><div class="data-value">: ${p.jenis}</div>
                            </div>
                            <div class="data-item">
                                <div class="data-label">Poin</div><div class="data-value">: ${p.poin}</div>
                            </div>
                        </li>`;
                });
                pelanggaranHtml += '</ul>';
            } else {
                pelanggaranDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data pelanggaran.</p>';
            }
        }

        function displayPeringatan(peringatan) {
            if (peringatan && peringatan.length > 0) {
                let peringatanHtml = '<ul>';
                peringatan.forEach(pe => {
                    peringatanHtml += `
                        <li>
                            <div class="data-item">
                                <div class="data-label">Tanggal</div><div class="data-value">: ${pe.tanggal}</div>
                            </div>
                            <div class="data-item">
                                <div class="data-label">Deskripsi</div><div class="data-value">: ${pe.deskripsi}</div>
                            </div>
                        </li>`;
                });
                peringatanHtml += '</ul>';
                peringatanDataDiv.innerHTML = peringatanHtml;
            } else {
                peringatanDataDiv.innerHTML = '<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>';
            }
        }

        function displayPrestasi(prestasi) {
            if (prestasi && prestasi.length > 0) {
                let prestasiHtml = '<ul>';
                prestasi.forEach(pr => {
                    prestasiHtml += `
                        <li>
                            <div class="data-item">
                                <div class="data-label">Tanggal</div><div class="data-value">: ${pr.tanggal}</div>
                            </div>
                            <div class="data-item">
                                <div class="data-label">Prestasi</div><div class="data-value">: ${pr.nama_prestasi}</div>
                            </div>
                            <div class="data-item">
                                <div class="data-label">Tingkat</div><div class="data-value">: ${pr.tingkat}</div>
                            </div>
                        </li>`;
                });
                prestasiHtml += '</ul>';
                prestasiDataDiv.innerHTML = prestasiHtml;
            } else {
                prestasiDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data prestasi.</p>';
            }
        }

        loadSantriData();
    }
});
