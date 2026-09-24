export const openapi = {
 openapi: "3.0.3",

 info: {
  title: "School Profile API",
  version: "1.0.0",
  description: "REST API untuk website profil sekolah.",
 },

 servers: [
  {
   url: "http://localhost:3000/api",
   description: "Development server",
  },
 ],

 tags: [
  { name: "Auth" },
  { name: "School Profile" },
  { name: "Staff" },
  { name: "Principal Histories" },
  { name: "Achievements" },
  { name: "Extracurriculars" },
  { name: "Extracurricular Media" },
  { name: "Facilities" },
  { name: "SPMB" },
  { name: "Contacts" },
  { name: "Social Media" },
 ],

 paths: {
  "/auth/login": {
   post: {
    tags: ["Auth"],
    summary: "Login admin",
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["email", "password"],
        properties: {
         email: { type: "string", format: "email" },
         password: { type: "string", format: "password" },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Login berhasil" },
     400: { description: "Data tidak valid" },
     401: { description: "Email atau password salah" },
    },
   },
  },

  "/auth/forgot-password": {
   post: {
    tags: ["Auth"],
    summary: "Meminta reset password",
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["email"],
        properties: {
         email: { type: "string", format: "email" },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Permintaan reset diproses" },
    },
   },
  },

  "/auth/reset-password": {
   post: {
    tags: ["Auth"],
    summary: "Reset password",
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["token", "password"],
        properties: {
         token: { type: "string" },
         password: { type: "string", format: "password" },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Password berhasil diubah" },
     400: { description: "Token atau data tidak valid" },
    },
   },
  },

  "/auth/refresh": {
   post: {
    tags: ["Auth"],
    summary: "Memperbarui access token",
    responses: {
     200: { description: "Access token berhasil diperbarui" },
     401: { description: "Refresh token tidak valid" },
    },
   },
  },

  "/auth/logout": {
   post: {
    tags: ["Auth"],
    summary: "Logout admin",
    responses: {
     200: { description: "Logout berhasil" },
    },
   },
  },

  "/school-profile": {
   get: {
    tags: ["School Profile"],
    summary: "Mendapatkan profil sekolah",
    responses: {
     200: { description: "Data profil sekolah" },
     404: { description: "Profil sekolah tidak ditemukan" },
    },
   },
   post: {
    tags: ["School Profile"],
    summary: "Membuat profil sekolah",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["schoolName"],
        properties: {
         schoolName: {
          type: "string",
          example: "SMA Contoh",
         },
         shortInfo: {
          type: "string",
          example: "Sekolah unggulan...",
         },
         about: {
          type: "string",
          example: "Tentang sekolah...",
         },
         history: {
          type: "string",
          example: "Sekolah didirikan pada tahun 1990.",
         },
         vision: {
          type: "string",
          example: "Menjadi sekolah yang unggul...",
         },
         mission: {
          type: "string",
          example: "Menyelenggarakan pendidikan berkualitas...",
         },
         banner: {
          type: "string",
          format: "binary",
         },
         logo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Profil berhasil dibuat" },
     401: { description: "Unauthorized" },
    },
   },
   put: {
    tags: ["School Profile"],
    summary: "Mengubah profil sekolah",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["schoolName"],
        properties: {
         schoolName: {
          type: "string",
          example: "SMA Contoh",
         },
         shortInfo: {
          type: "string",
          example: "Sekolah unggulan...",
         },
         about: {
          type: "string",
          example: "Tentang sekolah...",
         },
         history: {
          type: "string",
          example: "Sekolah didirikan pada tahun 1990.",
         },
         vision: {
          type: "string",
          example: "Menjadi sekolah yang unggul...",
         },
         mission: {
          type: "string",
          example: "Menyelenggarakan pendidikan berkualitas...",
         },
         banner: {
          type: "string",
          format: "binary",
         },
         logo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Profil berhasil diubah" },
     400: { description: "Data tidak valid" },
     401: { description: "Unauthorized" },
    },
   },
  },

  "/staff": {
   get: {
    tags: ["Staff"],
    summary: "Mendapatkan daftar staff",
    responses: {
     200: { description: "Daftar staff" },
    },
   },
   post: {
    tags: ["Staff"],
    summary: "Menambah staff",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name", "position", "type"],
        properties: {
         name: {
          type: "string",
          example: "Budi Santoso",
         },
         position: {
          type: "string",
          example: "Guru Matematika",
         },
         type: {
          type: "string",
          enum: ["TEACHER", "ADMINISTRATIVE"],
          example: "TEACHER",
         },
         classTaught: {
          type: "string",
          example: "Kelas X",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Staff berhasil ditambahkan" },
    },
   },
  },

  "/staff/{id}": {
   put: {
    tags: ["Staff"],
    summary: "Mengubah staff",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: {
       type: "integer",
      },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name", "position", "type"],
        properties: {
         name: {
          type: "string",
          example: "Budi Santoso",
         },
         position: {
          type: "string",
          example: "Guru Matematika",
         },
         type: {
          type: "string",
          enum: ["TEACHER", "ADMINISTRATIVE"],
          example: "TEACHER",
         },
         classTaught: {
          type: "string",
          example: "Kelas X",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     200: {
      description: "Staff berhasil diubah",
     },
     400: {
      description: "Data tidak valid",
     },
     401: {
      description: "Unauthorized",
     },
     404: {
      description: "Staff tidak ditemukan",
     },
    },
   },
   delete: {
    tags: ["Staff"],
    summary: "Menghapus staff",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Staff berhasil dihapus" },
    },
   },
  },

  "/principal-histories": {
   get: {
    tags: ["Principal Histories"],
    summary: "Mendapatkan riwayat kepala sekolah",
    responses: {
     200: { description: "Daftar riwayat kepala sekolah" },
    },
   },
   post: {
    tags: ["Principal Histories"],
    summary: "Menambah riwayat kepala sekolah",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["name", "period"],
        properties: {
         name: { type: "string", example: "Ahmad S.Pd." },
         period: { type: "string", example: "2018 - 2022" },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Data berhasil ditambahkan" },
    },
   },
  },

  "/principal-histories/{id}": {
   put: {
    tags: ["Principal Histories"],
    summary: "Mengubah riwayat kepala sekolah",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        properties: {
         name: {
          type: "string",
          example: "Drs. Budi Santoso",
         },
         period: {
          type: "string",
          example: "2020 - 2024",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Data berhasil diubah" },
    },
   },
   delete: {
    tags: ["Principal Histories"],
    summary: "Menghapus riwayat kepala sekolah",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Data berhasil dihapus" },
    },
   },
  },

  "/achievements": {
   get: {
    tags: ["Achievements"],
    summary: "Mendapatkan daftar prestasi",
    responses: {
     200: { description: "Daftar prestasi" },
    },
   },
   post: {
    tags: ["Achievements"],
    summary: "Menambah prestasi",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["competition", "studentName", "rank", "level", "year"],
        properties: {
         competition: {
          type: "string",
          example: "Olimpiade Matematika",
         },
         studentName: {
          type: "string",
          example: "Siti Aisyah",
         },
         rank: {
          type: "string",
          example: "Juara 1",
         },
         level: {
          type: "string",
          example: "Nasional",
         },
         year: {
          type: "integer",
          example: 2026,
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Prestasi berhasil ditambahkan" },
    },
   },
  },

  "/achievements/latest": {
   get: {
    tags: ["Achievements"],
    summary: "Mendapatkan 3 prestasi terbaru",
    description:
     "Digunakan pada halaman Home untuk menampilkan maksimal 3 prestasi terbaru.",
    responses: {
     200: {
      description: "3 prestasi terbaru berhasil diambil",
     },
    },
   },
  },

  "/achievements/{id}": {
   put: {
    tags: ["Achievements"],
    summary: "Mengubah prestasi",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["competition", "studentName", "rank", "level", "year"],
        properties: {
         competition: {
          type: "string",
          example: "Olimpiade Matematika",
         },
         studentName: {
          type: "string",
          example: "Siti Aisyah",
         },
         rank: {
          type: "string",
          example: "Juara 1",
         },
         level: {
          type: "string",
          example: "Nasional",
         },
         year: {
          type: "integer",
          example: 2026,
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Prestasi berhasil diubah" },
    },
   },
   delete: {
    tags: ["Achievements"],
    summary: "Menghapus prestasi",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Prestasi berhasil dihapus" },
    },
   },
  },

  "/extracurriculars": {
   get: {
    tags: ["Extracurriculars"],
    summary: "Mendapatkan daftar ekstrakurikuler",
    responses: {
     200: { description: "Daftar ekstrakurikuler" },
    },
   },
   post: {
    tags: ["Extracurriculars"],
    summary: "Menambah ekstrakurikuler",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name"],
        properties: {
         name: {
          type: "string",
          example: "Pramuka",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Ekstrakurikuler berhasil ditambahkan" },
    },
   },
  },

  "/extracurriculars/{id}": {
   get: {
    tags: ["Extracurriculars"],
    summary: "Mendapatkan detail ekstrakurikuler",
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Detail ekstrakurikuler" },
    },
   },
   put: {
    tags: ["Extracurriculars"],
    summary: "Mengubah ekstrakurikuler",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name"],
        properties: {
         name: {
          type: "string",
          example: "Pramuka",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Ekstrakurikuler berhasil diubah" },
    },
   },
   delete: {
    tags: ["Extracurriculars"],
    summary: "Menghapus ekstrakurikuler",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Ekstrakurikuler berhasil dihapus" },
    },
   },
  },

  "/extracurriculars/{id}/media": {
   post: {
    tags: ["Extracurricular Media"],
    summary: "Upload media ekstrakurikuler",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        properties: {
         file: {
          type: "string",
          format: "binary",
         },
        },
        required: ["file"],
       },
      },
     },
    },
    responses: {
     201: { description: "Media berhasil diupload" },
    },
   },
  },

  "/extracurriculars/{id}/media/{mediaId}": {
   delete: {
    tags: ["Extracurricular Media"],
    summary: "Menghapus media ekstrakurikuler",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
     {
      name: "mediaId",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Media berhasil dihapus" },
    },
   },
  },

  "/facilities": {
   get: {
    tags: ["Facilities"],
    summary: "Mendapatkan daftar fasilitas",
    responses: {
     200: { description: "Daftar fasilitas" },
    },
   },
   post: {
    tags: ["Facilities"],
    summary: "Menambah fasilitas",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name"],
        properties: {
         name: {
          type: "string",
          example: "Perpustakaan",
         },
         description: {
          type: "string",
          example: "Perpustakaan sekolah yang nyaman.",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Fasilitas berhasil ditambahkan" },
    },
   },
  },

  "/facilities/{id}": {
   put: {
    tags: ["Facilities"],
    summary: "Mengubah fasilitas",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["name"],
        properties: {
         name: {
          type: "string",
          example: "Perpustakaan",
         },
         description: {
          type: "string",
          example: "Perpustakaan sekolah yang nyaman.",
         },
         photo: {
          type: "string",
          format: "binary",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Fasilitas berhasil diubah" },
    },
   },
   delete: {
    tags: ["Facilities"],
    summary: "Menghapus fasilitas",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Fasilitas berhasil dihapus" },
    },
   },
  },

  "/spmb": {
   get: {
    tags: ["SPMB"],
    summary: "Mendapatkan informasi SPMB",
    responses: {
     200: { description: "Informasi SPMB" },
    },
   },
   post: {
    tags: ["SPMB"],
    summary: "Menambah informasi SPMB",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["title"],
        properties: {
         title: {
          type: "string",
          example: "SPMB Tahun Ajaran 2026/2027",
         },
         description: {
          type: "string",
          example: "Informasi pendaftaran peserta didik baru.",
         },
         photo: {
          type: "string",
          format: "binary",
         },
         portalUrl: {
          type: "string",
          format: "uri",
          example: "https://spmb.example.com",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "SPMB berhasil ditambahkan" },
    },
   },
  },

  "/spmb/{id}": {
   put: {
    tags: ["SPMB"],
    summary: "Mengubah informasi SPMB",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "multipart/form-data": {
       schema: {
        type: "object",
        required: ["title"],
        properties: {
         title: {
          type: "string",
          example: "SPMB Tahun Ajaran 2026/2027",
         },
         description: {
          type: "string",
          example: "Informasi pendaftaran peserta didik baru.",
         },
         photo: {
          type: "string",
          format: "binary",
         },
         portalUrl: {
          type: "string",
          format: "uri",
          example: "https://spmb.example.com",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "SPMB berhasil diubah" },
    },
   },
   delete: {
    tags: ["SPMB"],
    summary: "Menghapus informasi SPMB",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "SPMB berhasil dihapus" },
    },
   },
  },

  "/contacts": {
   get: {
    tags: ["Contacts"],
    summary: "Mendapatkan informasi kontak",
    responses: {
     200: { description: "Informasi kontak" },
    },
   },
   post: {
    tags: ["Contacts"],
    summary: "Menambah informasi kontak",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        properties: {
         address: { type: "string", nullable: true },
         phone: { type: "string", nullable: true },
         email: { type: "string", nullable: true },
         whatsapp: { type: "string", nullable: true },
         location: { type: "string", nullable: true },
         googleMaps: { type: "string", nullable: true },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Kontak berhasil ditambahkan" },
    },
   },
  },

  "/contacts/{id}": {
   put: {
    tags: ["Contacts"],
    summary: "Mengubah informasi kontak",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        properties: {
         address: {
          type: "string",
          example: "Jl. Pendidikan No. 10, Jakarta",
         },
         phone: {
          type: "string",
          example: "02112345678",
         },
         email: {
          type: "string",
          format: "email",
          example: "info@sekolah.sch.id",
         },
         whatsapp: {
          type: "string",
          example: "6281234567890",
         },
         location: {
          type: "string",
          example: "Jakarta Selatan",
         },
         googleMaps: {
          type: "string",
          format: "uri",
          example: "https://maps.google.com/?q=sekolah",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Kontak berhasil diubah" },
    },
   },
   delete: {
    tags: ["Contacts"],
    summary: "Menghapus informasi kontak",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Kontak berhasil dihapus" },
    },
   },
  },

  "/social-medias": {
   get: {
    tags: ["Social Media"],
    summary: "Mendapatkan daftar social media",
    responses: {
     200: { description: "Daftar social media" },
    },
   },
   post: {
    tags: ["Social Media"],
    summary: "Menambah social media",
    security: [{ bearerAuth: [] }],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["platform", "url"],
        properties: {
         platform: {
          type: "string",
          example: "Instagram",
         },
         url: {
          type: "string",
          example: "https://instagram.com/sekolah",
         },
        },
       },
      },
     },
    },
    responses: {
     201: { description: "Social media berhasil ditambahkan" },
    },
   },
  },

  "/social-medias/{id}": {
   put: {
    tags: ["Social Media"],
    summary: "Mengubah social media",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    requestBody: {
     required: true,
     content: {
      "application/json": {
       schema: {
        type: "object",
        required: ["platform", "url"],
        properties: {
         platform: {
          type: "string",
          example: "Instagram",
         },
         url: {
          type: "string",
          format: "uri",
          example: "https://instagram.com/sekolah",
         },
        },
       },
      },
     },
    },
    responses: {
     200: { description: "Social media berhasil diubah" },
    },
   },
   delete: {
    tags: ["Social Media"],
    summary: "Menghapus social media",
    security: [{ bearerAuth: [] }],
    parameters: [
     {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer" },
     },
    ],
    responses: {
     200: { description: "Social media berhasil dihapus" },
    },
   },
  },
 },

 components: {
  schemas: {
   SchoolProfile: {
    type: "object",
    properties: {
     id: { type: "integer" },
     schoolName: { type: "string" },
     shortInfo: { type: "string", nullable: true },
     about: { type: "string", nullable: true },
     history: { type: "string", nullable: true },
     vision: { type: "string", nullable: true },
     mission: { type: "string", nullable: true },
     bannerUrl: { type: "string", nullable: true },
     logoUrl: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Staff: {
    type: "object",
    properties: {
     id: { type: "integer" },
     name: { type: "string" },
     position: { type: "string" },
     type: {
      type: "string",
      enum: ["TEACHER", "ADMINISTRATIVE"],
     },
     classTaught: { type: "string", nullable: true },
     photoUrl: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Achievement: {
    type: "object",
    properties: {
     id: { type: "integer" },
     competition: { type: "string" },
     studentName: { type: "string" },
     rank: { type: "string" },
     level: { type: "string" },
     year: { type: "integer" },
     photoUrl: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   PrincipalHistory: {
    type: "object",
    properties: {
     id: { type: "integer" },
     name: { type: "string" },
     period: { type: "string" },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Extracurricular: {
    type: "object",
    properties: {
     id: { type: "integer" },
     name: { type: "string" },
     photoUrl: { type: "string", nullable: true },
     media: {
      type: "array",
      items: {
       $ref: "#/components/schemas/ExtracurricularMedia",
      },
     },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   ExtracurricularMedia: {
    type: "object",
    properties: {
     id: { type: "integer" },
     extracurricularId: { type: "integer" },
     type: {
      type: "string",
      enum: ["IMAGE", "VIDEO"],
     },
     url: { type: "string" },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Facility: {
    type: "object",
    properties: {
     id: { type: "integer" },
     name: { type: "string" },
     description: { type: "string", nullable: true },
     photoUrl: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Spmb: {
    type: "object",
    properties: {
     id: { type: "integer" },
     title: { type: "string" },
     description: { type: "string", nullable: true },
     photoUrl: { type: "string", nullable: true },
     portalUrl: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   Contact: {
    type: "object",
    properties: {
     id: { type: "integer" },
     address: { type: "string", nullable: true },
     phone: { type: "string", nullable: true },
     email: { type: "string", nullable: true },
     whatsapp: { type: "string", nullable: true },
     location: { type: "string", nullable: true },
     googleMaps: { type: "string", nullable: true },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },

   SocialMedia: {
    type: "object",
    properties: {
     id: { type: "integer" },
     platform: { type: "string" },
     url: { type: "string" },
     createdAt: { type: "string", format: "date-time" },
     updatedAt: { type: "string", format: "date-time" },
    },
   },
  },
  securitySchemes: {
   bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
   },
  },
 },
} as const;
