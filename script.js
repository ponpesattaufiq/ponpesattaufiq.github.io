document.addEventListener('DOMContentLoaded', () => {
    // --- Common Functions (for both index.html and dashboard.html) ---

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
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
    window.scrollToTop = function() { // Made global to be called from onclick
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // --- Index Page Specific Functionality ---
    const searchButton = document.getElementById('searchButton');
    if (searchButton) { // Only run this if on index.html
        searchButton.addEventListener('click', function() {
            const nikInput = document.getElementById('nikInput').value.trim();
            const resultBox = document.getElementById('resultBox');
            const noDataMessage = document.getElementById('noDataMessage');

            // Reset tampilan
            resultBox.style.display = 'none';
            noDataMessage.style.display = 'none';

            // Simulate data lookup
            if (nikInput === '12345' || nikInput === '98765') { // Example valid NIK/NISN
                resultBox.style.display = 'block';
                resultBox.querySelector('.result-item:nth-child(1) .result-value').textContent = 'Nama Santri Contoh';
                resultBox.querySelector('.result-item:nth-child(2) .result-value').textContent = nikInput;
                resultBox.querySelector('.result-item:nth-child(3) .result-value').textContent = 'ULA';
                resultBox.querySelector('.result-item:nth-child(4) .result-value').textContent = 'Aktif';
                resultBox.querySelector('.result-item:nth-child(5) .result-value').textContent = '2022';
            } else {
                noDataMessage.style.display = 'block';
            }
        });

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Simple hardcoded check for demonstration
                if (username === 'admin' && password === 'admin123') {
                    loginMessage.style.display = 'none';
                    alert('Login successful! Redirecting to dashboard...');
                    // In a real application, you'd store a token/session here
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    loginMessage.textContent = 'Username atau password salah.';
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
                // In a real application, you would:
                // 1. Clear user session/token from localStorage or cookies
                // 2. Redirect to a login page or home page
                // Example: localStorage.removeItem('authToken');
                window.location.href = 'index.html'; // Redirect to home/login
            }
        });
    }

    // Function to simulate fetching data (replace with actual API calls)
    const fetchSantriData = async (nis) => {
        // In a real scenario, this would be an API call, e.g.:
        // const response = await fetch(`/api/santri/${nis}`);
        // if (!response.ok) throw new Error('Data not found');
        // return await response.json();

        // Mock data for demonstration
        const mockData = {
            '12345': {
                info: {
                    nis: '12345',
                    nama: 'Muhammad Alif',
                    kelas: 'XII IPS',
                    jurusan: 'Ilmu Pengetahuan Sosial',
                    alamat: 'Jl. Contoh No. 123, Surabaya'
                },
                raport: [
                    { semester: 'Ganjil 2024/2025', mata_pelajaran: 'Aqidah Akhlak', nilai: 85 },
                    { semester: 'Ganjil 2024/2025', mata_pelajaran: 'Fiqh', nilai: 90 },
                    { semester: 'Ganjil 2024/2025', mata_pelajaran: 'Bahasa Arab', nilai: 88 },
                    { semester: 'Genap 2023/2024', mata_pelajaran: 'Aqidah Akhlak', nilai: 82 },
                    { semester: 'Genap 2023/2024', mata_pel.ajaran: 'Fiqh', nilai: 87 },
                ],
                pelanggaran: [
                    { tanggal: '2025-01-15', jenis: 'Terlambat Datang', poin: 5 },
                    { tanggal: '2024-11-20', jenis: 'Tidak Memakai Peci', poin: 2 },
                ],
                peringatan: [
                    { tanggal: '2025-02-01', pesan: 'Mohon segera melunasi SPP bulan Januari.' },
                ],
                prestasi: [
                    { tanggal: '2024-10-01', jenis: 'Juara 3 Lomba Pidato Bahasa Arab', tingkat: 'Kabupaten' },
                ]
            },
            '67890': {
                 info: {
                    nis: '67890',
                    nama: 'Siti Fatimah',
                    kelas: 'XI IPA',
                    jurusan: 'Ilmu Pengetahuan Alam',
                    alamat: 'Jl. Anggrek No. 45, Sidoarjo'
                },
                raport: [], // No raport data
                pelanggaran: [],
                peringatan: [],
                prestasi: [
                    { tanggal: '2025-03-10', jenis: 'Juara 1 MTQ Tingkat Pondok', tingkat: 'Pondok' },
                ]
            }
        };

        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockData[nis]);
            }, 500);
        });
    };

    // --- Data Display Functions (for dashboard.html) ---

    const displaySantriInfo = (info) => {
        const santriInfoDiv = document.getElementById('santriInfo');
        if (info) {
            santriInfoDiv.innerHTML = `
                <p><strong>NIS:</strong> ${info.nis}</p>
                <p><strong>Nama:</strong> ${info.nama}</p>
                <p><strong>Kelas:</strong> ${info.kelas}</p>
                <p><strong>Jurusan:</strong> ${info.jurusan}</p>
                <p><strong>Alamat:</strong> ${info.alamat}</p>
            `;
        } else {
            santriInfoDiv.innerHTML = `<p class="no-data-info">Data informasi santri tidak ditemukan.</p>`;
        }
    };

    const displayRaportData = (raport) => {
        const raportDataDiv = document.getElementById('raportData');
        if (raport && raport.length > 0) {
            let tableHtml = `<table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Semester</th>
                                        <th>Mata Pelajaran</th>
                                        <th>Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            raport.forEach(item => {
                tableHtml += `<tr>
                                <td>${item.semester}</td>
                                <td>${item.mata_pelajaran}</td>
                                <td>${item.nilai}</td>
                              </tr>`;
            });
            tableHtml += `</tbody></table>`;
            raportDataDiv.innerHTML = tableHtml;
        } else {
            raportDataDiv.innerHTML = `<p class="no-data-info">Data raport belum tersedia.</p>`;
        }
    };

    const displayPelanggaranData = (pelanggaran) => {
        const pelanggaranDataDiv = document.getElementById('pelanggaranData');
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
                                <td>${item.tanggal}</td>
                                <td>${item.jenis}</td>
                                <td>${item.poin}</td>
                              </tr>`;
            });
            tableHtml += `</tbody></table>`;
        } else {
            pelanggaranDataDiv.innerHTML = `<p class="no-data-info">Tidak ada data pelanggaran.</p>`;
        }
    };

    const displayPeringatanData = (peringatan) => {
        const peringatanDataDiv = document.getElementById('peringatanData');
        if (peringatan && peringatan.length > 0) {
            let tableHtml = `<table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Pesan</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            peringatan.forEach(item => {
                tableHtml += `<tr>
                                <td>${item.tanggal}</td>
                                <td>${item.pesan}</td>
                              </tr>`;
            });
            tableHtml += `</tbody></table>`;
        } else {
            peringatanDataDiv.innerHTML = `<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>`;
        }
    };

    const displayPrestasiData = (prestasi) => {
        const prestasiDataDiv = document.getElementById('prestasiData');
        if (prestasi && prestasi.length > 0) {
            let tableHtml = `<table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Jenis Prestasi</th>
                                        <th>Tingkat</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            prestasi.forEach(item => {
                tableHtml += `<tr>
                                <td>${item.tanggal}</td>
                                <td>${item.jenis}</td>
                                <td>${item.tingkat}</td>
                              </tr>`;
            });
            tableHtml += `</tbody></table>`;
        } else {
            prestasiDataDiv.innerHTML = `<p class="no-data-info">Tidak ada data prestasi.</p>`;
        }
    };

    // Main function to load dashboard data (only if on dashboard.html)
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) { // Check if dashboard container exists
        const loadDashboardData = async () => {
            const dataUnavailableMessage = document.getElementById('dataUnavailableMessage');
            dataUnavailableMessage.style.display = 'none'; // Hide by default

            // In a real application, NIS would come from user session/login.
            // For demonstration, let's use a NIS stored in localStorage after login.
            const nis = localStorage.getItem('currentSantriNIS');

            if (!nis) {
                // If no NIS found in local storage, prompt for it (for direct access to dashboard)
                const promptNis = prompt("Silakan masukkan NIS Santri untuk melihat data (contoh: 12345 atau 67890):");
                if (promptNis) {
                    localStorage.setItem('currentSantriNIS', promptNis);
                    window.location.reload(); // Reload to apply the NIS
                    return;
                } else {
                    dataUnavailableMessage.style.display = 'block';
                    dataUnavailableMessage.textContent = 'NIS tidak dimasukkan. Data tidak dapat dimuat.';
                    // Clear all data sections
                    document.getElementById('santriInfo').innerHTML = `<p class="no-data-info">Data informasi santri tidak ditemukan.</p>`;
                    document.getElementById('raportData').innerHTML = `<p class="no-data-info">Data raport belum tersedia.</p>`;
                    document.getElementById('pelanggaranData').innerHTML = `<p class="no-data-info">Tidak ada data pelanggaran.</p>`;
                    document.getElementById('peringatanData').innerHTML = `<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>`;
                    document.getElementById('prestasiData').innerHTML = `<p class="no-data-info">Tidak ada data prestasi.</p>`;
                    return;
                }
            }


            try {
                const data = await fetchSantriData(nis);
                if (data) {
                    // Update dashboard title with santri's name if available
                    const dashboardTitle = document.getElementById('dashboardTitle');
                    if (dashboardTitle && data.info && data.info.nama) {
                        dashboardTitle.textContent = `Data Raport Santri ${data.info.nama}`;
                    }

                    displaySantriInfo(data.info);
                    displayRaportData(data.raport);
                    displayPelanggaranData(data.pelanggaran);
                    displayPeringatanData(data.peringatan);
                    displayPrestasiData(data.prestasi);
                } else {
                    dataUnavailableMessage.style.display = 'block';
                    // Clear existing data sections if no data found for the given NIS
                    document.getElementById('santriInfo').innerHTML = `<p class="no-data-info">Data informasi santri tidak ditemukan.</p>`;
                    document.getElementById('raportData').innerHTML = `<p class="no-data-info">Data raport belum tersedia.</p>`;
                    document.getElementById('pelanggaranData').innerHTML = `<p class="no-data-info">Tidak ada data pelanggaran.</p>`;
                    document.getElementById('peringatanData').innerHTML = `<p class="no-data-info">Tidak ada peringatan/pemberitahuan.</p>`;
                    document.getElementById('prestasiData').innerHTML = `<p class="no-data-info">Tidak ada data prestasi.</p>`;
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                dataUnavailableMessage.textContent = 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.';
                dataUnavailableMessage.style.display = 'block';
            }
        };

        // Load data when the dashboard page loads
        loadDashboardData();
    }
});
