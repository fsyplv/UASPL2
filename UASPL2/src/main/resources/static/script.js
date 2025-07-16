document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('formPendaftaran');
    const selectTopik = document.getElementById('topik');
    const pesanKonfirmasi = document.getElementById('pesanKonfirmasi');

    const API_URL = 'http://localhost:8080';

    async function muatTopikSeminar() {
        try {
            
            const dataTopik = [
                { id: 1, nama: 'Pengembangan Web Modern dengan React' },
                { id: 2, nama: 'Machine Learning untuk Pemula' },
                { id: 3, nama: 'Manajemen Proyek Agile' },
                { id: 4, nama: 'Dasar-dasar UI/UX Design' }
            ];

            selectTopik.innerHTML = '<option value="">-- Pilih Topik --</option>'; // Opsi default
            
            dataTopik.forEach(topik => {
                const option = document.createElement('option');
                option.value = topik.nama;
                option.textContent = topik.nama;
                selectTopik.appendChild(option);
            });

        } catch (error) {
            console.error('Error:', error);
            selectTopik.innerHTML = '<option value="">Gagal memuat topik</option>';
        }
    }

    muatTopikSeminar();

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        if (!validasiForm()) {
            return;
        }

        const formData = {
            namaLengkap: document.getElementById('namaLengkap').value,
            email: document.getElementById('email').value,
            instansi: document.getElementById('instansi').value,
            topik: selectTopik.value,
            metodePembayaran: document.querySelector('input[name="metodePembayaran"]:checked').value
        };
        
        try {
            const response = await fetch(`${API_URL}/api/pendaftaran`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) { 
                const hasil = await response.json();
                tampilkanPesan('Pendaftaran berhasil! Terima kasih telah mendaftar.', 'sukses');
                form.reset(); 
                console.log('Respon sukses:', hasil);
            } else {
                
                const errorData = await response.json();
                throw new Error(errorData.message || 'Terjadi kesalahan saat mengirim data.');
            }

        } catch (error) {
            console.error('Error:', error);
            tampilkanPesan(error.message, 'gagal');
        }
    });

    /**
     * Fungsi untuk menampilkan pesan di halaman
     * @param {string} teks - Teks pesan yang akan ditampilkan
     * @param {string} tipe - 'sukses' atau 'gagal'
     */
    function tampilkanPesan(teks, tipe) {
        pesanKonfirmasi.textContent = teks;
        pesanKonfirmasi.className = `pesan ${tipe}`; 
    }

    function validasiForm() {
        const email = document.getElementById('email').value;
        const nama = document.getElementById('namaLengkap').value;
        const metodeBayar = document.querySelector('input[name="metodePembayaran"]:checked');

        if (nama.trim() === '') {
            tampilkanPesan('Nama lengkap wajib diisi.', 'gagal');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            tampilkanPesan('Format email tidak valid. Contoh: nama@domain.com', 'gagal');
            return false;
        }

        if (!metodeBayar) {
            tampilkanPesan('Metode pembayaran wajib dipilih.', 'gagal');
            return false;
        }
        
        pesanKonfirmasi.style.display = 'none';
        return true;
    }
});