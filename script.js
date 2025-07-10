document.addEventListener('DOMContentLoaded', () => {
    // === Bagian untuk Halaman Login (index.html) ===
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        const loginButton = document.getElementById('loginButton');

        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Mencegah form submit secara default

                loginButton.disabled = true; // Nonaktifkan tombol saat proses
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
                        localStorage.setItem('loggedInNIK', user.NIK); // Simpan NIK di localStorage
                        localStorage.setItem('loggedInUsername', user.username);
                        loginMessage.style.display = 'none';
                        window.location.href = 'dashboard.html'; // Redirect ke halaman dashboard
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
    }

    // === Bagian untuk Halaman Dashboard (dashboard.html) ===
    if (window.location.pathname.endsWith('dashboard.html')) {
        const loggedInNIK = localStorage.getItem('loggedInNIK');
        const logoutButton = document.getElementById('logoutButton');

        // Jika tidak ada NIK yang login, redirect ke halaman login
        if (!loggedInNIK) {
            window.location.href = 'index.html';
            return; // Hentikan eksekusi script lebih lanjut
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
                localStorage.removeItem('loggedInNIK'); // Hapus NIK dari localStorage
                localStorage.removeItem('loggedInUsername');
                window.location.href = 'index.html'; // Redirect ke halaman login
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
                    dashboardTitle.textContent = `Data Santri: ${foundSantri.nama}`; // Update title
                    displaySantriInfo(foundSantri);
                    displayRaport(foundSantri.raport);
                    displayPelanggaran(foundSantri.pelanggaran);
                    displayPeringatan(foundSantri.peringatan);
                    displayPrestasi(foundSantri.prestasi);
                    dataUnavailableMessage.style.display = 'none';
                } else {
                    santriInfoDiv.innerHTML = '<p class="no-data-info">Data santri tidak ditemukan untuk NIK Anda.</p>';
                    dataUnavailableMessage.style.display = 'block';
                    // Sembunyikan bagian-bagian lain jika data santri tidak ditemukan
                    raportDataDiv.innerHTML = '<p class="no-data-info">Data raport belum tersedia.</p>';
                    pelanggaranDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data pelanggaran.</p>';
                    peringatanDataDiv.innerHTML = '<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>';
                    prestasiDataDiv.innerHTML = '<p class="no-data-info">Tidak ada data prestasi.</p>';
                }
            } catch (error) {
                console.error("Error memuat data santri:", error);
                santriInfoDiv.innerHTML = '<p class="error-message">Terjadi kesalahan saat memuat data santri. Silakan coba lagi nanti.</p>';
                dataUnavailableMessage.style.display = 'block'; // Tampilkan pesan error
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
                let raportHtml = '<ul>';
                for (const semester in raport) {
                    raportHtml += `<li><h3>${semester.replace(/_/g, ' ').toUpperCase()}</h3><ul>`;
                    for (const mataPelajaran in raport[semester]) {
                        raportHtml += `
                            <li class="data-item">
                                <div class="data-label">${mataPelajaran.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                                <div class="data-value">: ${raport[semester][mataPelajaran]}</div>
                            </li>`;
                    }
                    raportHtml += '</ul></li>';
                }
                raportHtml += '</ul>';
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
                pelanggaranDataDiv.innerHTML = pelanggaranHtml;
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

        loadSantriData(); // Panggil fungsi untuk memuat data saat dashboard dimuat
    }
});
