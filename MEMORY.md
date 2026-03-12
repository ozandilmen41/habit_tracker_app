# 🧠 Project Memory & Architecture (Time-Based Habit Tracker)

## 🎯 Proje Özeti

Bu proje, süre bazlı (time-based) bir alışkanlık takip (habit tracker) mobil uygulamasıdır. Kullanıcılar oluşturdukları etkinliklere sayaç tutar, günlük hedeflerini (saat bazında) tamamlamaya çalışır ve ilerlemelerini bir "Veri Tablosu" (Data Table) görünümünde takip eder.

## 🛠️ Tech Stack & Kurallar

- **Framework:** React Native (Expo)
- **Routing:** Expo Router (File-based navigation)
- **State Management:** Zustand
- **Storage:** `@react-native-async-storage/async-storage` (Kritik: Expo Go uyumluluğu için MMKV YERİNE bu kullanılıyor. Kesinlikle MMKV'ye dönüştürme!)
- **SVG / UI:** `react-native-svg` (Dairesel ilerleme çubukları için)

## 🏗️ Mimari Kararlar (Kritik - Bunları Değiştirme)

### 1. Veri Yapısı ($O(1)$ Lookup)

Loglar dizilerde (array) değil, performans için iç içe Record (Hash Map) yapısında tutulur.
`logs: Record<habitId, Record<dateString, minutes>>`
_Kural:_ Veri çekerken ASLA `filter` veya `find` kullanma, doğrudan `logs[id][date]` ile çek.
_Önemli:_ Tüm süre değerleri **dakika** (minutes) bazlıdır. Hedefler ve loglar dakika cinsinden tutulur.

### 2. Timer (Sayaç) Mantığı (Background-Safe)

Mobil arka plan kısıtlamaları nedeniyle sayaç ASLA `setInterval` ile saniye saniye artırılarak tutulmaz.
_Kural:_ Zustand'da `activeSession: { habitId, startTime, accumulatedTime, status }` tutulur. Gerçek süre her zaman `Date.now() - startTime + accumulatedTime` formülü ile hesaplanır. `setInterval` sadece UI'ı güncellemek için Timer sayfasında kullanılır.

### 3. Layout Matematiği (Veri Tablosu - Pixel Perfect)

Ekranda 7 günü kaydırma yapmadan, isimleri ezmeden tutmak için kesin ölçüler şunlardır:

- **Sol Sütun (Sabit):** `width: 130` (İçinde CircularProgress ve HabitName var, flexShrink: 1, ortalanmış).
- **Sağ Sütun (Tek ScrollView):** 14 günlük tarih aralığı tutar. İçindeki her hücre (Header ve DaySlot) SABİT `width: 36` olmalıdır.
- **Satır Yükseklikleri:** Header için sabit `70px`, Row'lar için sabit `60px`.

### 4. Takvim Akışı (Reverse Chronological)

Takvim dizisi her zaman "Bugün"den başlar ve sağa kaydırıldıkça geçmişe gider (Index 0 = Bugün, Index 13 = 14 gün önce).

## ✅ Tamamlanan Özellikler (MVP Phase 1)

- [x] Zustand store ve AsyncStorage entegrasyonu.
- [x] 14 Günlük ters kronolojik takvim hesaplaması.
- [x] Sticky Header ve Data Table Scroll mimarisi (Pixel-perfect hizalama).
- [x] HabitSelectionModal (Hangi aktiviteye başlıyoruz? + Yeni Ekle).
- [x] Create Habit (Günlük hedef süre belirleme).
- [x] Timer Page (Mola, Devam Et, Bitir - Background safe math).
- [x] SVG Circular Progress Bar (130px sol sütun içinde, NaN korumalı, >%100 destekli).
- [x] Day Slots (Geçmiş Gün Verileri): DaySlot hücreleri log kayıtlarını görselleştiriyor. Yapılmadıysa açık gri çarpı (×), yapıldıysa 28px daire içinde süre (mavi: kısmi, yeşil: hedef tamamlandı). O(1) lookup ile performanslı.
- [x] Detailed Analysis Page (/habit/[id]): Dinamik rota ile alışkanlık detay sayfası. Header (isim + hedef), özet istatistikler (Toplam Süre, Kaydedilen Gün), 30 günlük görünüm (flex-wrap ile renkli kareler), Danger Zone (silme butonu). HabitNameCell'den navigasyon. useMemo ile optimize edilmiş hesaplamalar.
- [x] Phase 2: Advanced Analytics & UI Polish - Profesyonel dashboard kalitesinde detay sayfası yenileme. 4 istatistik kartı (Toplam Süre, Toplam Gün, Günlük Ortalama, Mevcut Seri/Streak), 7 günlük bar grafiği (harici kütüphane kullanmadan View bileşenleriyle), 30 günlük heatmap grid (40x40 yuvarlak hücreler, içinde gün numarası, renk kodlaması). Streak hesaplaması useMemo ile optimize.
- [x] Büyük Rework (Phase 3): Dakika bazlı takip sistemine geçiş - Tüm uygulama saat yerine dakika bazlı çalışıyor. Zustand store, UI bileşenleri, istatistikler dakika cinsinden. Koyu tema (#111827, #1f2937) tüm sayfalara uygulandı. Tüm emoji'ler kaldırıldı. Ana aksiyon butonları yeşil (#22c55e). Timer sayfası minimalist tasarım (navbar yok, yan yana yeşil butonlar). DaySlot tıklama pop-up'ı eklendi (log bilgisi gösterimi).

## 🚀 Bekleyen Özellikler (Roadmap)

(Gelecek geliştirmeler için boş - MVP + Phase 2 + Rework tamamlandı!)

## 🤖 Agent (Yapay Zeka) Talimatları

- Projede herhangi bir değişiklik yapmadan önce **her zaman** bu `MEMORY.md` dosyasını referans al.
- Uygulamanın mimarisini (özellikle width ölçüleri, AsyncStorage tercihi, dakika bazlı sistem) asla kendi kararınla bozma.
- **KRİTİK:** Hiçbir yerde emoji kullanma. Tüm butonlar yeşil (#22c55e) olmalı. Koyu tema (#111827) zorunlu.
- Bir görevi başarıyla tamamladığında, `MEMORY.md` dosyasındaki "Tamamlanan Özellikler" ve "Bekleyen Özellikler" listesini sessizce güncelle.
