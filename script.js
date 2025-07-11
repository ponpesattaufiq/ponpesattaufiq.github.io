document.addEventListener('DOMContentLoaded', () => {
    // --- Common Functions (for both index.html and dashboard.html) ---

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const mainHeader = document.querySelector('.main-header');
                const headerOffset = mainHeader ? mainHeader.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Show/hide scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.style.display = "block";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        };
    }

    // Scroll to Top Function
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // --- Index Page Specific Functionality ---
    const searchButton = document.getElementById('searchButton');
    if (searchButton) { // Only run this if on index.html
        searchButton.addEventListener('click', async function() {
            const nikInput = document.getElementById('nikInput').value.trim();
            const resultBox = document.getElementById('resultBox');
            const noDataMessage = document.getElementById('noDataMessage');

            // Ambil elemen-elemen spesifik berdasarkan ID
            const resultNIK = document.getElementById('resultNIK');
            const resultName = document.getElementById('resultName');
            const resultJenisKelamin = document.getElementById('resultJenisKelamin');
            const resultTTL = document.getElementById('resultTTL');
            const resultAlamat = document.getElementById('resultAlamat');
            const resultAyah = document.getElementById('resultAyah');
            const resultIbu = document.getElementById('resultIbu');
            const resultNoHp = document.getElementById('resultNoHp');


            // Reset tampilan
            resultBox.style.display = 'none';
            noDataMessage.style.display = 'none';
            noDataMessage.textContent = 'Data santri tidak ditemukan.'; // Default message

            // Memastikan semua elemen result-value ditemukan sebelum melanjutkan
            if (!resultNIK || !resultName || !resultJenisKelamin || !resultTTL || !resultAlamat || !resultAyah || !resultIbu || !resultNoHp) {
                console.error("Error: One or more result display elements not found in index.html. Please ensure all 'result-value' spans have unique IDs (e.g., resultNIK, resultName, etc.) and exist within #resultBox.");
                noDataMessage.textContent = 'Terjadi kesalahan pada struktur tampilan data. Mohon laporkan ke admin.';
                noDataMessage.style.display = 'block';
                return;
            }

            try {
                const response = await fetch('data_santri.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const allSantri = await response.json(); // data_santri.json is an array

                // Find the santri by NIK
                const foundSantri = allSantri.find(santri => santri.NIK === nikInput);

                if (foundSantri) {
                    resultBox.style.display = 'block';
                    // Pastikan urutan di bawah ini sesuai dengan urutan ID di index.html dan nama properti di data_santri.json
                    resultNIK.textContent = foundSantri.NIK || 'Tidak Tersedia';
                    resultName.textContent = foundSantri.nama || 'Tidak Tersedia';
                    resultJenisKelamin.textContent = foundSantri.jenis_kelamin || 'Tidak Tersedia';
                    resultTTL.textContent = foundSantri.tempat_tanggal_lahir || 'Tidak Tersedia';
                    resultAlamat.textContent = foundSantri.alamat || 'Tidak Tersedia';
                    resultAyah.textContent = foundSantri.nama_ayah || 'Tidak Tersedia';
                    resultIbu.textContent = foundSantri.nama_ibu || 'Tidak Tersedia';
                    resultNoHp.textContent = foundSantri.nomor_hp || 'Tidak Tersedia';
                } else {
                    noDataMessage.style.display = 'block';
                    noDataMessage.textContent = 'Data santri tidak ditemukan. Pastikan Data yang benar & menggunakan NIK.';
                }
            } catch (error) {
                console.error('Error fetching santri data for search:', error);
                noDataMessage.textContent = 'Terjadi kesalahan saat mencari data. Silakan coba lagi nanti.';
                noDataMessage.style.display = 'block';
            }
        });

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        if (loginForm) {
            loginForm.addEventListener('submit', async function(event) {
                event.preventDefault();

                const usernameInput = document.getElementById('username').value;
                const passwordInput = document.getElementById('password').value;

                loginMessage.style.display = 'none'; // Reset message

                try {
                    const response = await fetch('users.json');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const users = await response.json();

                    const foundUser = users.find(user => user.username === usernameInput && user.password === passwordInput);

                    if (foundUser) {
                        alert('Login berhasil! Mengarahkan ke dashboard...');
                        // Store the NIK of the logged-in user for dashboard
                        localStorage.setItem('currentSantriNIK', foundUser.NIK);
                        window.location.href = 'dashboard.html';
                    } else {
                        loginMessage.textContent = 'Username atau password salah.';
                        loginMessage.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    loginMessage.textContent = 'Terjadi kesalahan saat login. Silakan coba lagi nanti.';
                    loginMessage.style.display = 'block';
                }
            });
        }
    }


    // --- Dashboard Page Specific Functionality ---

    // Logout functionality (for dashboard.html)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmLogout = confirm('Apakah Anda yakin ingin keluar?');
            if (confirmLogout) {
                localStorage.removeItem('currentSantriNIK'); // Clear the stored NIK
                window.location.href = 'index.html';
            }
        });
    }

    // Function to fetch data for a specific NIK from data_santri.json
    const fetchSantriDataByNIK = async (nik) => {
        try {
            const response = await fetch('data_santri.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allSantri = await response.json();
            return allSantri.find(santri => santri.NIK === nik);
        } catch (error) {
            console.error('Failed to fetch santri data:', error);
            return null;
        }
    };

    // --- Data Display Functions (for dashboard.html) ---

    const displaySantriInfo = (info) => {
        const santriInfoDiv = document.getElementById('santriInfo');
        if (santriInfoDiv) {
            if (info) {
                santriInfoDiv.innerHTML = `
                    <p><strong>NIK:</strong> ${info.NIK || 'Tidak Tersedia'}</p>
                    <p><strong>Nama:</strong> ${info.nama || 'Tidak Tersedia'}</p>
                    <p><strong>Jenis Kelamin:</strong> ${info.jenis_kelamin || 'Tidak Tersedia'}</p>
                    <p><strong>Tempat, Tanggal Lahir:</strong> ${info.tempat_tanggal_lahir || 'Tidak Tersedia'}</p>
                    <p><strong>Alamat:</strong> ${info.alamat || 'Tidak Tersedia'}</p>
                    <p><strong>Nama Ayah:</strong> ${info.nama_ayah || 'Tidak Tersedia'}</p>
                    <p><strong>Nama Ibu:</strong> ${info.nama_ibu || 'Tidak Tersedia'}</p>
                    <p><strong>No. HP:</strong> ${info.nomor_hp || 'Tidak Tersedia'}</p>
                `;
            } else {
                santriInfoDiv.innerHTML = `<p class="no-data-info">Data informasi santri tidak ditemukan.</p>`;
            }
        }
    };

    const displayRaportData = (raport) => {
        const raportDataDiv = document.getElementById('raportData');
        if (raportDataDiv) {
            if (raport && Object.keys(raport).length > 0) {
                let tableHtml = `<table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Semester</th>
                                                <th>Matematika</th>
                                                <th>Bahasa Indonesia</th>
                                                <th>IPA</th>
                                                <th>Bahasa Arab</th>
                                                <th>Tahfidz Qur'an</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                for (const semesterKey in raport) {
                    const semesterData = raport[semesterKey];
                    tableHtml += `<tr>
                                        <td>${semesterKey.replace('_', ' ').replace('semester', 'Semester ')}</td>
                                        <td>${semesterData.matematika !== undefined ? semesterData.matematika : '-'}</td>
                                        <td>${semesterData.bahasa_indonesia !== undefined ? semesterData.bahasa_indonesia : '-'}</td>
                                        <td>${semesterData.ipa !== undefined ? semesterData.ipa : '-'}</td>
                                        <td>${semesterData.bahasa_arab !== undefined ? semesterData.bahasa_arab : '-'}</td>
                                        <td>${semesterData.tahfidz_quran !== undefined ? semesterData.tahfidz_quran : '-'}</td>
                                    </tr>`;
                }
                tableHtml += `</tbody></table>`;
                raportDataDiv.innerHTML = tableHtml;
            } else {
                raportDataDiv.innerHTML = `<p class="no-data-info">Data raport belum tersedia.</p>`;
            }
        }
    };

    const displayPelanggaranData = (pelanggaran) => {
        const pelanggaranDataDiv = document.getElementById('pelanggaranData');
        if (pelanggaranDataDiv) {
            if (pelanggaran && pelanggaran.length > 0) {
                let tableHtml = `<table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Jenis Pelanggaran</th>
                                                <th>Poin</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                pelanggaran.forEach(item => {
                    tableHtml += `<tr>
                                        <td>${item.tanggal || '-'}</td>
                                        <td>${item.jenis || '-'}</td>
                                        <td>${item.poin !== undefined ? item.poin : '-'}</td>
                                    </tr>`;
                });
                tableHtml += `</tbody></table>`;
                pelanggaranDataDiv.innerHTML = tableHtml;
            } else {
                pelanggaranDataDiv.innerHTML = `<p class="no-data-info">Tidak ada data pelanggaran.</p>`;
            }
        }
    };

    const displayPeringatanData = (peringatan) => {
        const peringatanDataDiv = document.getElementById('peringatanData');
        if (peringatanDataDiv) {
            if (peringatan && peringatan.length > 0) {
                let tableHtml = `<table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Deskripsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                peringatan.forEach(item => {
                    tableHtml += `<tr>
                                        <td>${item.tanggal || '-'}</td>
                                        <td>${item.deskripsi || '-'}</td>
                                    </tr>`;
                });
                tableHtml += `</tbody></table>`;
                peringatanDataDiv.innerHTML = tableHtml;
            } else {
                peringatanDataDiv.innerHTML = `<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>`;
            }
        }
    };

    const displayPrestasiData = (prestasi) => {
        const prestasiDataDiv = document.getElementById('prestasiData');
        if (prestasiDataDiv) {
            if (prestasi && prestasi.length > 0) {
                let tableHtml = `<table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Nama Prestasi</th>
                                                <th>Tingkat</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                prestasi.forEach(item => {
                    tableHtml += `<tr>
                                        <td>${item.tanggal || '-'}</td>
                                        <td>${item.nama_prestasi || '-'}</td>
                                        <td>${item.tingkat || '-'}</td>
                                    </tr>`;
                });
                tableHtml += `</tbody></table>`;
                prestasiDataDiv.innerHTML = tableHtml;
            } else {
                prestasiDataDiv.innerHTML = `<p class="no-data-info">Tidak ada data prestasi.</p>`;
            }
        }
    };

    // Main function to load dashboard data (only if on dashboard.html)
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        const loadDashboardData = async () => {
            const dataUnavailableMessage = document.getElementById('dataUnavailableMessage');
            if (!dataUnavailableMessage) {
                console.error("Element with ID 'dataUnavailableMessage' not found in dashboard.html.");
                return;
            }
            dataUnavailableMessage.style.display = 'none';

            let currentSantriNIK = localStorage.getItem('currentSantriNIK');

            if (!currentSantriNIK) {
                const promptNIK = prompt("Silakan masukkan NIK Santri untuk melihat data (contoh: 123 atau 6543210987654321):");
                if (promptNIK) {
                    localStorage.setItem('currentSantriNIK', promptNIK);
                    currentSantriNIK = promptNIK;
                } else {
                    dataUnavailableMessage.style.display = 'block';
                    dataUnavailableMessage.textContent = 'NIK tidak dimasukkan. Data tidak dapat dimuat.';
                    // Clear all data sections
                    displaySantriInfo(null);
                    displayRaportData(null);
                    displayPelanggaranData(null);
                    displayPeringatanData(null);
                    displayPrestasiData(null);
                    return;
                }
            }

            try {
                const data = await fetchSantriDataByNIK(currentSantriNIK);
                if (data) {
                    const dashboardTitle = document.getElementById('dashboardTitle');
                    if (dashboardTitle && data.nama) {
                        dashboardTitle.textContent = `Data Raport Santri ${data.nama}`;
                    } else if (dashboardTitle) {
                           dashboardTitle.textContent = `Data Raport Santri`;
                    }

                    displaySantriInfo(data); // Pass the whole data object
                    displayRaportData(data.raport);
                    displayPelanggaranData(data.pelanggaran);
                    displayPeringatanData(data.peringatan);
                    displayPrestasiData(data.prestasi);
                } else {
                    dataUnavailableMessage.textContent = `Maaf, data untuk NIK ${currentSantriNIK} Anda tidak ditemukan. Silakan hubungi admin pondok pesantren.`;
                    dataUnavailableMessage.style.display = 'block';
                    displaySantriInfo(null);
                    displayRaportData(null);
                    displayPelanggaranData(null);
                    displayPeringatanData(null);
                    displayPrestasiData(null);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                dataUnavailableMessage.textContent = 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.';
                dataUnavailableMessage.style.display = 'block';
            }
        };

        loadDashboardData();
    }
});
