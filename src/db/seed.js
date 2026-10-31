import bcrypt from "bcryptjs";
import { Favorite, Item, User } from "../models/index.js";

const ITEMS = [
  ["a", "Jaket Denim Levi's Vintage", "Ukuran M, warna biru washed, tanpa cacat.", 185000, "Fashion", "Seperti Baru", "Sumatera Utara", "Kabupaten Toba", "Jl. Sisingamangaraja No. 12, Balige"],
  ["b", "Headphone Sony WH-CH510", "Bluetooth, baterai awet, lengkap dengan kabel charger.", 250000, "Elektronik", "Baik", "Sumatera Utara", "Kota Medan", "Jl. Gatot Subroto No. 45"],
  ["a", "Meja Belajar Kayu Jati", "Panjang 120 cm, ada 2 laci. Cocok untuk kamar kos.", 350000, "Furniture", "Baik", "Sumatera Utara", "Kabupaten Toba", "Jl. Gereja No. 3, Balige"],
  ["b", "Novel Laskar Pelangi", "Cetakan lama, halaman utuh, tanpa coretan.", 35000, "Buku", "Layak Pakai", "Sumatera Utara", "Kota Medan", "Jl. Iskandar Muda No. 18"],
  ["a", "Gitar Akustik Yamaha F310", "Senar baru diganti, bonus softcase.", 900000, "Hobi", "Baik", "Sumatera Utara", "Kabupaten Toba", "Jl. Patuan Nagari No. 7, Balige"],
  ["b", "Sepeda Lipat 16 inci", "Rem dan rantai normal, ban baru.", 1200000, "Olahraga", "Baik", "Sumatera Utara", "Kota Pematangsiantar", "Jl. Merdeka No. 88"],
  ["a", "Rice Cooker Miyako 1.8L", "Dipakai 1 tahun, pindah kos jadi dijual.", 120000, "Rumah Tangga", "Seperti Baru", "Sumatera Utara", "Kabupaten Toba", "Komp. Asrama Del, Laguboti"],
  ["b", "Sepatu Lari Nike Revolution", "Ukuran 42, sol masih tebal.", 275000, "Olahraga", "Baik", "Sumatera Utara", "Kota Medan", "Jl. Setiabudi No. 102"],
  ["a", "Kemeja Flanel Kotak", "Ukuran L, bahan tebal dan adem.", 60000, "Fashion", "Layak Pakai", "Sumatera Utara", "Kabupaten Toba", "Jl. Somba Debata, Balige"],
  ["b", "Keyboard Mekanik 60%", "Switch blue, keycaps PBT.", 420000, "Elektronik", "Baik", "Sumatera Utara", "Kota Medan", "Jl. Dr. Mansyur No. 25"],
  ["a", "Rak Buku Susun 4 Tingkat", "Mudah dibongkar pasang, tinggi 140 cm.", 150000, "Furniture", "Baik", "Sumatera Utara", "Kabupaten Toba", "Jl. Pematang Siantar-Medan, Balige"],
  ["b", "Set Lego Classic 790 pcs", "Lengkap, sudah dicuci bersih.", 300000, "Hobi", "Seperti Baru", "Sumatera Utara", "Kota Medan", "Jl. Asia No. 50"],
];

export async function seedDatabase() {
  await Favorite.destroy({ where: {} });
  await Item.destroy({ where: {} });
  await User.destroy({ where: {} });
  const password = bcrypt.hashSync("demo123", 8);
  const a = await User.create({ name: "Demo Seller", email: "demo@nextowner.id", password, province: "Sumatera Utara", city: "Kabupaten Toba", address: "Jl. Sisingamangaraja No. 12, Balige" });
  const b = await User.create({ name: "Sinta Marpaung", email: "sinta@nextowner.id", password, province: "Sumatera Utara", city: "Kota Medan", address: "Jl. Gatot Subroto No. 45" });
  const sellers = { a: a.id, b: b.id };
  for (const [who, title, description, price, category, condition, province, city, address] of ITEMS) {
    await Item.create({ sellerId: sellers[who], title, description, price, category, condition, province, city, address });
  }
  return { users: 2, items: ITEMS.length };
}
