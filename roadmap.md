# Roadmap Aplikasi Penjana Kod QR (QR Code Generator)

Berikut adalah cadangan roadmap untuk pembangunan aplikasi Penjana Kod QR. Roadmap ini dirancang untuk meningkatkan fungsionaliti teras, memperkenalkan ciri-ciri inovatif berkuasa AI, dan memperluas jangkauan aplikasi untuk pengguna profesional.

---

### **Fasa 1: Peningkatan Ciri Teras & Pengalaman Pengguna (Jangka Pendek)**

Matlamat fasa ini adalah untuk mengukuhkan asas aplikasi, menjadikannya lebih serba boleh dan menyeronokkan untuk digunakan.

1.  **Jenis Kod QR Tambahan:**
    *   **Acara Kalendar (Event):** Benarkan pengguna membuat kod QR yang boleh terus menambah acara ke dalam kalendar (contohnya, Google Calendar, iCal).
    *   **Lokasi Geografi:** Cipta kod QR yang membuka lokasi spesifik di Peta Google atau Peta Apple.
    *   **Hubungan Pantas (SMS/Telefon):** Hasilkan kod QR untuk menghantar SMS atau membuat panggilan telefon dengan nombor dan mesej yang telah diisi.

2.  **Penyesuaian Reka Bentuk Lanjutan:**
    *   **Bentuk *Eye* (Mata QR):** Berikan pilihan untuk mengubah bentuk tiga penanda sudut pada kod QR (contohnya, bulat, berlian).
    *   **Gaya Titik (Dot Style) yang Pelbagai:** Tambah lebih banyak variasi selain daripada kotak dan titik, seperti bintang atau bentuk unik yang lain.
    *   **Bingkai Logo:** Sediakan pilihan untuk menambah bingkai (contohnya, bulatan atau kotak) di sekeliling logo agar lebih menonjol dan mudah dibaca.

3.  **Peningkatan UI/UX:**
    *   **Pratonton Masa Nyata (Real-time):** Hapuskan jeda *loading* semasa. Kod QR harus dikemas kini serta-merta apabila pengguna menaip atau mengubah tetapan warna dan saiz.
    *   **Templat Reka Bentuk (Presets):** Sediakan galeri templat reka bentuk kod QR yang menarik secara visual. Pengguna boleh memilih satu templat dan kemudian menyesuaikannya.

---

### **Fasa 2: Integrasi Ciri Pintar dengan Gemini API (Jangka Sederhana)**

Fasa ini akan menjadi pembeza utama aplikasi anda daripada pesaing dengan memanfaatkan kekuatan AI generatif.

1.  **"AI Design Assistant" (Pembantu Reka Bentuk AI):**
    *   **Ciri:** Tambah butang "Cadangkan Reka Bentuk" yang disokong oleh Gemini.
    *   **Cara Berfungsi:** Pengguna memasukkan data (contohnya, URL laman web mereka) dan boleh memberikan prom ringkas seperti *"Cipta reka bentuk yang kelihatan profesional untuk firma guaman"* atau *"Gunakan warna yang sepadan dengan laman web saya"*.
    *   **Pelaksanaan:** Gemini API akan menganalisis prom (dan mungkin warna dominan dari URL yang diberikan) untuk mencadangkan palet warna, gaya titik, dan bentuk *eye* yang sesuai, yang kemudiannya diterapkan secara automatik.

2.  **Penjanaan Kandungan Automatik:**
    *   **Ringkasan URL:** Apabila pengguna memasukkan URL artikel yang panjang, gunakan Gemini untuk secara automatik menghasilkan ringkasan pendek yang boleh dimasukkan ke dalam kod QR jenis teks.
    *   **Pengekstrakan Maklumat vCard:** Benarkan pengguna menampal blok teks maklumat hubungan (contohnya, dari tandatangan e-mel). Gemini akan secara pintar mengekstrak nama, nombor telefon, e-mel, dan syarikat untuk mengisi borang vCard secara automatik.

3.  **Kod QR Dinamik (Memerlukan Backend):**
    *   Ini adalah ciri premium di mana URL destinasi kod QR boleh diubah pada bila-bila masa, walaupun selepas dicetak. Ini memerlukan sistem akaun pengguna dan pangkalan data untuk menguruskan pengalihan.

---

### **Fasa 3: Analitik & Alat untuk Pengguna Profesional (Jangka Panjang)**

Fasa ini bertujuan untuk memenuhi keperluan perniagaan dan pengguna peringkat lanjutan.

1.  **Papan Pemuka Analitik (Analytics Dashboard):**
    *   Untuk kod QR dinamik, sediakan papan pemuka yang memaparkan data imbasan (scan): jumlah imbasan, lokasi geografi (tanpa nama), masa, dan jenis peranti yang digunakan. Data ini dipersembahkan dalam bentuk grafik yang mudah difahami.

2.  **Penjanaan Pukal (Bulk Generation):**
    *   Benarkan pengguna memuat naik fail CSV untuk menjana ratusan kod QR sekaligus. Sangat berguna untuk kad perniagaan pekerja, label produk, atau tiket acara. Hasilnya boleh dimuat turun dalam bentuk fail ZIP.

3.  **Akses API:**
    *   Sediakan API awam agar pembangun lain boleh mengintegrasikan fungsionaliti penjanaan kod QR anda ke dalam aplikasi mereka.
