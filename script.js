// --- PWA Service Worker Registration ---
// Pastikan file service-worker.js dan manifest.json ada di root folder Anda
// serta ikon-ikon yang disebutkan dalam manifest.json (misal: logo-192x192.png, logo-512x512.png)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
// --- End PWA Service Worker Registration ---


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
    if (searchButton) { // Only execute this block if 'searchButton' exists (i.e., on index.html)
        searchButton.addEventListener('click', async function() {
            const nikInput = document.getElementById('nikInput').value.trim();
            // --- BARIS BARU: Ambil nilai angkatan dari input baru di index.html ---
            const angkatanInput = document.getElementById('angkatanSearchInput').value.trim();

            const resultBox = document.getElementById('resultBox');
            const noDataMessage = document.getElementById('noDataMessage');

            // Get specific elements to display results
            const displaySantriName = document.getElementById('displaySantriName');
            const resultNIK = document.getElementById('resultNIK');
            const resultName = document.getElementById('resultName');
            const resultJenisKelamin = document.getElementById('resultJenisKelamin');
            const resultTTL = document.getElementById('resultTTL');
            const resultAlamat = document.getElementById('resultAlamat');
            const resultAyah = document.getElementById('resultAyah');
            const resultIbu = document.getElementById('resultIbu');
            const resultNoHp = document.getElementById('resultNoHp');

            // Reset display before new search
            if (resultBox) resultBox.style.display = 'none';
            if (noDataMessage) {
                noDataMessage.style.display = 'none';
                noDataMessage.textContent = 'Data santri tidak ditemukan.'; // Default message
            }

            // --- PERUBAHAN: Validasi NIK dan Angkatan ---
            if (!nikInput && !angkatanInput) {
                if (noDataMessage) {
                    noDataMessage.textContent = 'Mohon masukkan NIK dan Angkatan Santri.';
                    noDataMessage.style.display = 'block';
                }
                return;
            } else if (!nikInput) {
                if (noDataMessage) {
                    noDataMessage.textContent = 'Mohon masukkan NIK Santri.';
                    noDataMessage.style.display = 'block';
                }
                return;
            } else if (!angkatanInput) {
                if (noDataMessage) {
                    noDataMessage.textContent = 'Mohon masukkan Angkatan Santri.';
                    noDataMessage.style.display = 'block';
                }
                return;
            }


            try {
                // *** PERUBAHAN UTAMA: Ubah path file JSON untuk menyertakan angkatan ***
                const filePath = `data/${angkatanInput}/${nikInput}.json`;
                const response = await fetch(filePath);

                if (!response.ok) {
                    // If response is not OK (e.g., 404 Not Found)
                    if (response.status === 404) {
                        if (noDataMessage) {
                            // --- PERUBAHAN: Pesan error lebih spesifik ---
                            noDataMessage.textContent = `Data santri dengan NIK ${nikInput} untuk angkatan ${angkatanInput} tidak ditemukan. Pastikan NIK dan Angkatan benar.`;
                        }
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    if (noDataMessage) noDataMessage.style.display = 'block';
                    return; // Stop execution
                }

                const santriData = await response.json(); // Data for a single santri

                if (santriData) {
                    if (resultBox) resultBox.style.display = 'block'; // Show the result box

                    // Populate the result elements with found data (General Info) ONLY IF they exist
                    if (displaySantriName) displaySantriName.textContent = santriData.nama || 'Tidak Tersedia';
                    if (resultNIK) resultNIK.textContent = santriData.NIK || 'Tidak Tersedia';
                    if (resultName) resultName.textContent = santriData.nama || 'Tidak Tersedia';
                    if (resultJenisKelamin) resultJenisKelamin.textContent = santriData.jenis_kelamin || 'Tidak Tersedia';
                    if (resultTTL) resultTTL.textContent = santriData.tempat_tanggal_lahir || 'Tidak Tersedia';
                    if (resultAlamat) resultAlamat.textContent = santriData.alamat || 'Tidak Tersedia';
                    if (resultAyah) resultAyah.textContent = santriData.nama_ayah || 'Tidak Tersedia';
                    if (resultIbu) resultIbu.textContent = santriData.nama_ibu || 'Tidak Tersedia';
                    if (resultNoHp) resultNoHp.textContent = santriData.nomor_hp || 'Tidak Tersedia';

                } else {
                    if (noDataMessage) {
                        noDataMessage.style.display = 'block';
                        noDataMessage.textContent = 'Data santri tidak ditemukan.';
                    }
                }
            } catch (error) {
                console.error('Error fetching santri data for search:', error);
                if (noDataMessage) {
                    noDataMessage.textContent = 'Terjadi kesalahan saat mencari data. Silakan coba lagi nanti.';
                    noDataMessage.style.display = 'block';
                }
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
                // --- PERHATIAN: Untuk login, jika Anda ingin juga memvalidasi atau menggunakan angkatan,
                // --- Anda perlu menambahkan input 'angkatan' di formulir login dan mengambil nilainya di sini.
                // --- Serta memastikan 'users.json' memiliki properti 'angkatan' untuk setiap user.
                // --- Saat ini, saya TIDAK mengubah logika login untuk angkatan karena belum diminta secara spesifik.

                if (loginMessage) loginMessage.style.display = 'none';

                try {
                    // Fetch user data from 'users.json' (assuming this file still holds login credentials)
                    const response = await fetch('users.json');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const users = await response.json();

                    const foundUser = users.find(user => user.username === usernameInput && user.password === passwordInput);

                    if (foundUser) {
                        alert('Login berhasil! Mengarahkan ke dashboard...');
                        // Store the NIK of the logged-in user in localStorage for dashboard access
                        localStorage.setItem('currentSantriNIK', foundUser.NIK);
                        // --- Jika Anda ingin dashboard juga memuat data berdasarkan angkatan login,
                        // --- Anda perlu menyimpan angkatan di localStorage dari 'foundUser' juga.
                        // --- Misalnya: localStorage.setItem('currentSantriAngkatan', foundUser.angkatan);
                        window.location.href = 'dashboard.html'; // Redirect to dashboard
                    } else {
                        if (loginMessage) {
                            loginMessage.textContent = 'Username atau password salah.';
                            loginMessage.style.display = 'block';
                        }
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    if (loginMessage) {
                        loginMessage.textContent = 'Terjadi kesalahan saat login. Silakan coba lagi nanti.';
                        loginMessage.style.display = 'block';
                    }
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
                localStorage.removeItem('currentSantriNIK'); // Clear stored NIK
                // --- Jika Anda menyimpan 'angkatan' saat login, Anda juga perlu menghapusnya di sini:
                // --- localStorage.removeItem('currentSantriAngkatan');
                window.location.href = 'index.html'; // Redirect to index page
            }
        });
    }

    // Function to fetch data for a specific NIK from data/{ANGKATAN}/{NIK}.json
    // --- PERUBAHAN: Fungsi ini sekarang menerima 'angkatan' sebagai parameter kedua ---
    const fetchSantriDataByNIK = async (nik, angkatan) => {
        if (!nik || !angkatan) {
            console.error("NIK atau Angkatan tidak diberikan untuk fetchSantriDataByNIK.");
            return null;
        }
        try {
            // *** PERUBAHAN: Ubah path fetch data untuk menyertakan angkatan ***
            const response = await fetch(`data/${angkatan}/${nik}.json`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`File data/${angkatan}/${nik}.json not found.`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return null;
            }
            return await response.json(); // Directly return the santri object
        } catch (error) {
            console.error('Failed to fetch santri data:', error);
            return null;
        }
    };

    // Displays general santri information
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

    // Displays raport data in a table
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

    // Displays violation data in a table
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

    // Displays warning/notification data in a table
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

    // Displays achievement data in a table
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
                console.error("Element with ID 'dataUnavailableMessage' not found in dashboard.html. This is crucial for error messages.");
                return; // Exit if critical element is missing
            }
            dataUnavailableMessage.style.display = 'none';

            let currentSantriNIK = localStorage.getItem('currentSantriNIK');
            // --- BARU: Ambil angkatan juga dari localStorage jika sudah disimpan saat login ---
            // --- CATATAN: Ini mengasumsikan Anda akan memodifikasi login di atas untuk menyimpan angkatan juga.
            // --- Jika tidak, Anda mungkin perlu cara lain untuk mendapatkan angkatan di dashboard.
            let currentSantriAngkatan = localStorage.getItem('currentSantriAngkatan'); // Contoh penambahan

            if (!currentSantriNIK || !currentSantriAngkatan) { // --- PERUBAHAN: Validasi NIK dan Angkatan untuk dashboard ---
                const promptNIK = prompt("Silakan masukkan NIK Santri untuk melihat data (contoh: 123 atau 6543210987654321):");
                const promptAngkatan = prompt("Silakan masukkan Angkatan Santri (contoh: 2024-2025):"); // --- BARU
                
                if (promptNIK && promptAngkatan) { // --- PERUBAHAN
                    localStorage.setItem('currentSantriNIK', promptNIK);
                    localStorage.setItem('currentSantriAngkatan', promptAngkatan); // --- BARU
                    currentSantriNIK = promptNIK;
                    currentSantriAngkatan = promptAngkatan; // --- BARU
                } else {
                    dataUnavailableMessage.style.display = 'block';
                    dataUnavailableMessage.textContent = 'NIK atau Angkatan tidak dimasukkan. Data tidak dapat dimuat.'; // --- PERUBAHAN
                    // Clear displayed info if NIK or Angkatan is not provided
                    displaySantriInfo(null);
                    displayRaportData(null);
                    displayPelanggaranData(null);
                    displayPeringatanData(null);
                    displayPrestasiData(null);
                    return;
                }
            }

            try {
                // --- PERUBAHAN: Panggil fetchSantriDataByNIK dengan angkatan juga ---
                const data = await fetchSantriDataByNIK(currentSantriNIK, currentSantriAngkatan); // Fetch data using the NIK and Angkatan
                if (data) {
                    const dashboardTitle = document.getElementById('dashboardTitle');
                    if (dashboardTitle && data.nama) {
                        dashboardTitle.textContent = `Data Raport Santri ${data.nama}`;
                    } else if (dashboardTitle) {
                        dashboardTitle.textContent = `Data Raport Santri`;
                    }

                    displaySantriInfo(data);
                    displayRaportData(data.raport);
                    displayPelanggaranData(data.pelanggaran);
                    displayPeringatanData(data.peringatan);
                    displayPrestasiData(data.prestasi);
                } else {
                    // --- PERUBAHAN: Pesan error lebih spesifik untuk dashboard ---
                    dataUnavailableMessage.textContent = `Maaf, data untuk NIK ${currentSantriNIK} Angkatan ${currentSantriAngkatan} tidak ditemukan. Silakan hubungi admin pondok pesantren.`;
                    dataUnavailableMessage.style.display = 'block';
                    // Clear displayed info if no data is found
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

    // Login/Logout button visibility toggle (for header)
    const mainLoginButton = document.getElementById('mainLoginButton');
    const logoutButtonHeader = document.getElementById('logoutButton'); // Make sure this refers to the header logout button

    if (mainLoginButton && logoutButtonHeader) {
        const currentSantriNIK = localStorage.getItem('currentSantriNIK');
        // --- BARU: Periksa juga angkatan jika ingin visibilitas bergantung pada login penuh ---
        const currentSantriAngkatan = localStorage.getItem('currentSantriAngkatan');

        if (currentSantriNIK && currentSantriAngkatan) { // --- PERUBAHAN: Cek NIK dan Angkatan
            mainLoginButton.style.display = 'none';
            logoutButtonHeader.style.display = 'block';
        } else {
            mainLoginButton.style.display = 'block';
            logoutButtonHeader.style.display = 'none';
        }
    }
});
