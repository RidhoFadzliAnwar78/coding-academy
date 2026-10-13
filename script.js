"use strict";
// ========================================
// 1. DATA GALLERY
// ========================================
const galleryData = [
    {
        judul: "Belajar Dasar Pemrograman",
        deskripsi: "Peserta mengenal logika, variabel, dan perulangan melalui latihan bersama mentor.",
        foto: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        alt: "Kegiatan belajar menggunakan komputer"
    },
    {
        judul: "Praktik Membuat Website",
        deskripsi: "Membangun halaman web menggunakan HTML, CSS, dan JavaScript secara langsung.",
        foto: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        alt: "Laptop untuk kegiatan pengembangan website"
    },
    {
        judul: "Diskusi Kelompok",
        deskripsi: "Peserta berbagi ide, berdiskusi, dan memecahkan masalah pemrograman bersama.",
        foto: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
        alt: "Tim sedang berdiskusi"
    },
    {
        judul: "Workshop Python",
        deskripsi: "Mengenal Python untuk mengolah data dan membuat program sederhana.",
        foto: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        alt: "Kode program pada layar komputer"
    },
    {
        judul: "Debugging Bersama Mentor",
        deskripsi: "Belajar menemukan kesalahan kode dan memperbaikinya dengan cara yang tepat.",
        foto: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        alt: "Kolaborasi tim dalam proyek teknologi"
    },
    {
        judul: "Presentasi Proyek Akhir",
        deskripsi: "Peserta mempresentasikan hasil proyek dan mendapatkan masukan dari mentor.",
        foto: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        alt: "Kegiatan presentasi dan diskusi"
    }
];

// ========================================
// 2. PILIHAN BAHASA PEMROGRAMAN
// ========================================
const bahasaData = [
    "HTML/CSS",
    "JavaScript",
    "Python",
    "Java",
    "PHP"
];

// ========================================
// 3. FUNGSI PEMBANTU
// ========================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
// Mencegah teks input dibaca sebagai HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[char];
    });
}

// ========================================
// 4. MENAMPILKAN GALLERY
// ========================================
function renderGallery() {
    const grid = $("#grid");
    grid.innerHTML = galleryData.map((item) => `
        <article class="card">
            <img
                class="art"
                src="${item.foto}"
                alt="${item.alt}"
                loading="lazy"
            >
            <div class="cb">
                <h3>${item.judul}</h3>
                <p>${item.deskripsi}</p>
            </div>
        </article>
    `).join("");
    // Tampilkan keterangan jika foto gagal dimuat
    $$("#grid img").forEach((img) => {
        img.addEventListener("error", () => {
            img.alt = "Foto tidak dapat dimuat: " + img.alt;
            img.classList.add("image-error");
        });
    });
}

// ========================================
// 5. MENAMPILKAN PILIHAN BAHASA
// ========================================
function renderBahasa() {
    $("#langs").innerHTML = bahasaData.map((bahasa) => `
        <label class="opt">
            <input
                type="radio"
                name="bahasa"
                value="${bahasa}"
            >
            <span class="radio-ui"></span>
            ${bahasa}
        </label>
    `).join("");
}

// ========================================
// 6. NAVIGASI GALLERY DAN PENDAFTARAN
// ========================================
function showPage(page) {
    const gallery = $("#gallery");
    const daftar = $("#daftar");
    gallery.classList.toggle("hide", page !== "gallery");
    daftar.classList.toggle("hide", page !== "daftar");
    $$(".nav-btn").forEach((button) => {
        const aktif = button.dataset.page === page;
        button.classList.toggle("on", aktif);
        button.setAttribute("aria-current", aktif ? "page" : "false");
    });
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
$$("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// ========================================
// 7. ATURAN VALIDASI
// ========================================
const rules = {
    nik: (value) => /^\d{16}$/.test(value),
    nama: (value) =>
        value.length >= 3 &&
        value.length <= 100 &&
        /^[\p{L}\s.'-]+$/u.test(value),
    hp: (value) => {
        const nomor = value.replace(/[\s()-]/g, "");
        return /^(?:\+62|62|0)8\d{8,11}$/.test(nomor);
    },
    alamat: (value) =>
        value.length >= 10 && value.length <= 500
};

// ========================================
// 8. VALIDASI FORM
// ========================================
function validateForm() {
    const data = {};
    let firstInvalid = null;
    // Validasi NIK, nama, nomor HP, dan alamat
    ["nik", "nama", "hp", "alamat"].forEach((key) => {
        const input = $("#" + key);
        const value = input.value.trim();
        data[key] = value;
        const valid = rules[key](value);
        const field = $(`[data-f="${key}"]`);
        field.classList.toggle("bad", !valid);
        input.setAttribute("aria-invalid", String(!valid));
        if (!valid && !firstInvalid) {
            firstInvalid = input;
        }
    });
    // Validasi jenis kelamin dan bahasa
    ["jk", "bahasa"].forEach((key) => {
        const selected = $(`input[name="${key}"]:checked`);
        data[key] = selected ? selected.value : "";
        const field = $(`[data-f="${key}"]`);
        const valid = Boolean(selected);
        field.classList.toggle("bad", !valid);
        if (!valid && !firstInvalid) {
            firstInvalid = field.querySelector("input");
        }
    });
    return {
        data,
        firstInvalid
    };
}

// ========================================
// 9. MEMBERSIHKAN PESAN ERROR
// ========================================
$$("input, textarea").forEach((input) => {
    input.addEventListener("input", () => {
        const field = input.closest(".f");
        if (field && field.classList.contains("bad")) {
            field.classList.remove("bad");
            input.removeAttribute("aria-invalid");
        }
    });
    input.addEventListener("change", () => {
        const field = input.closest(".f");
        if (
            field &&
            field.dataset.f &&
            field.dataset.f !== "nik" &&
            field.dataset.f !== "nama" &&
            field.dataset.f !== "hp" &&
            field.dataset.f !== "alamat"
        ) {
            if (input.checked) {
                field.classList.remove("bad");
            }
        }
    });
});
// NIK hanya menerima angka dan maksimal 16 digit
$("#nik").addEventListener("input", (event) => {
    event.target.value = event.target.value
        .replace(/\D/g, "")
        .slice(0, 16);
});

// ========================================
// 10. MENAMPILKAN HASIL PENDAFTARAN
// ========================================
function renderHasil(data) {
    const hasil = [
        ["NIK", data.nik],
        ["Nama Lengkap", data.nama],
        ["Jenis Kelamin", data.jk],
        ["Nomor HP", data.hp],
        ["Alamat", data.alamat],
        ["Bahasa Pemrograman", data.bahasa]
    ];
    $("#res").innerHTML = hasil.map(([label, value]) => `
        <div>
            <dt>${label}</dt>
            <dd>${escapeHTML(value)}</dd>
        </div>
    `).join("");
}

// ========================================
// 11. PROSES SIMPAN FORM
// ========================================
$("#form").addEventListener("submit", (event) => {
    event.preventDefault();
    const { data, firstInvalid } = validateForm();
    // Jika data tidak valid, hentikan proses
    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }
    // Dialog konfirmasi sesuai instruksi tugas
    const yakin = confirm(
        "Apakah Anda sudah yakin untuk menyimpan?"
    );
    // Jika memilih Tidak, form tetap terbuka
    if (!yakin) {
        return;
    }
    // Jika memilih Ya, tampilkan hasil pendaftaran
    renderHasil(data);
    $("#formPanel").classList.add("hide");
    $("#resPanel").classList.remove("hide");
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ========================================
// 12. RESET FORM
// ========================================
$("#rst").addEventListener("click", () => {
    setTimeout(() => {
        $$(".f.bad").forEach((field) => {
            field.classList.remove("bad");
        });

        $$("[aria-invalid]").forEach((input) => {
            input.removeAttribute("aria-invalid");
        });
    }, 0);
});

// ========================================
// 13. DAFTAR PESERTA BARU
// ========================================
$("#again").addEventListener("click", () => {
    $("#form").reset();

    $$(".f.bad").forEach((field) => {
        field.classList.remove("bad");
    });

    $$("[aria-invalid]").forEach((input) => {
        input.removeAttribute("aria-invalid");
    });

    $("#resPanel").classList.add("hide");
    $("#formPanel").classList.remove("hide");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ========================================
// 14. INISIALISASI WEBSITE
// ========================================
renderGallery();
renderBahasa();
showPage("gallery");