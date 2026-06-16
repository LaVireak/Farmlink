/**
 * useCambodiaLocations
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides cascading Province → District → Commune dropdown data for Cambodia,
 * plus a Nominatim-based geocoding helper that converts a location string into
 * { lat, lng } coordinates for use in the map tracking feature.
 */

import { computed, ref, watch } from 'vue';

// ─── Cambodia Location Data ───────────────────────────────────────────────────
// Key provinces with districts and communes (representative subset covering all
// 25 provinces; expand as needed for full coverage).
export const CAMBODIA_LOCATIONS: Record<string, Record<string, string[]>> = {
  'Phnom Penh': {
    'Chamkarmon': ['Tonle Bassac', 'Boeung Keng Kang I', 'Boeung Keng Kang II', 'Boeung Keng Kang III', 'Tumnob Tuek'],
    'Daun Penh': ['Phsar Kandal I', 'Phsar Kandal II', 'Wat Phnom', 'Chey Chumneas', 'Chaktomouk'],
    'Prampir Meakkakra': ['Boeung Prolit', 'Phsar Thmei I', 'Phsar Thmei II', 'Phsar Thmei III', 'Veal Vong'],
    'Tuol Kork': ['Boeng Kak I', 'Boeng Kak II', 'Phnom Penh Thmei', 'Toek L\'ak I', 'Toek L\'ak II'],
    'Dangkao': ['Dangkao', 'Krang Thnong', 'Prateah Lang', 'Preaek Ta Sek', 'Prey Sa'],
    'Mean Chey': ['Boeng Tumpun I', 'Boeng Tumpun II', 'Chak Angrae Kraom', 'Chak Angrae Leu', 'Stung Meanchey I'],
    'Russey Keo': ['Chrouy Changvar', 'Koh Dach', 'Preaek Lieb', 'Preaek Ta Sek', 'Russey Keo'],
    'Saensokh': ['Phnom Penh Thmei', 'Ruessei Kaev', 'Saensokh', 'Khmuonh', 'Tuek Thla'],
    'Pur Senchey': ['Chaom Chau I', 'Chaom Chau II', 'Chaom Chau III', 'Kakab I', 'Kakab II'],
    'Chroy Changvar': ['Chroy Changvar', 'Preaek Lieb', 'Kien Svay Khang Lech', 'Preaek Ta Kov'],
    'Prek Pnov': ['Preaek Pnov', 'Preaek Ta Pang', 'Cheung Prey'],
  },
  'Siem Reap': {
    'Krong Siem Reap': ['Kouk Chak', 'Sala Kamraeuk', 'Svay Dankum', 'Slor Kram', 'Nokor Thum'],
    'Angkor Chum': ['Angkor Chum', 'Kouk Doung', 'Pongro', 'Srayang', 'Tuek Vil'],
    'Angkor Thom': ['Banteay Chhmar', 'Nokor Krao', 'Srei Nouy', 'Svay Leu'],
    'Banteay Srei': ['Banteay Srei', 'Khnang Phnom', 'Labeansiek'],
    'Chi Kraeng': ['Chi Kraeng', 'Kandaek', 'Krabei Riel', 'Prasat'],
    'Kralanh': ['Kralanh', 'Pouk', 'Salakomroeuk'],
    'Puok': ['Puok', 'Khnar', 'Prasat Bakong'],
    'Prasat Bakong': ['Bakong', 'Khnar', 'Krabei Riel'],
    'Srei Snam': ['Srei Snam', 'Khnar', 'Kouk Doung'],
    'Svay Leu': ['Svay Leu', 'Kna', 'Phumi Svay'],
    'Varin': ['Varin', 'Kampong Kdei', 'Sla Kram'],
  },
  'Battambang': {
    'Krong Battambang': ['Svay Pao', 'Ratanak', 'Chhut', 'Phsar Boeung Chhouk', 'Kdol Tahen'],
    'Banon': ['Banon', 'Bavel', 'Kdol Tahen', 'Nhang', 'Ou Ta Kou'],
    'Bavel': ['Bavel', 'Kirivong', 'Kouk Banteay', 'Ou Char'],
    'Ek Phnom': ['Ek Phnom', 'Kdol Tahen', 'Ou Char', 'Svay Tep'],
    'Kamrieng': ['Kamrieng', 'Anlong Vil', 'Boeung Pring'],
    'Moung Ruessei': ['Moung', 'Ampil Pram Dab', 'Bovel'],
    'Phnum Proek': ['Phnum Proek', 'Ampil Pram Dab'],
    'Rotanak Mondol': ['Rotanak Mondol', 'Anlong Vil'],
    'Sangke': ['Sangke', 'Kdol Tahen', 'Svay Pao'],
    'Thmor Kol': ['Thmor Kol', 'Anlong Vil'],
    'Thma Koul': ['Thma Koul', 'Boeung Pring'],
    'Sampov Lun': ['Sampov Lun', 'Chambak'],
  },
  'Kampong Cham': {
    'Kampong Cham': ['Veal Vong', 'Kampong Cham', 'Boeng Kok'],
    'Batheay': ['Batheay', 'Choeung Prey', 'Kouk Kandal'],
    'Chamkar Leu': ['Chamkar Leu', 'Kampong Siem', 'Kean Kleang'],
    'Cheung Prey': ['Cheung Prey', 'Choeung Prey', 'Prey Krabas'],
    'Dambae': ['Dambae', 'Kampong Cham', 'Prey Krabas'],
    'Kampong Siem': ['Kampong Siem', 'Kouk Kandal'],
    'Kang Meas': ['Kang Meas', 'Anlung Kang'],
    'Koh Sotin': ['Koh Sotin', 'Kampong Cham'],
    'Prey Chhor': ['Prey Chhor', 'Choeung Prey'],
    'Srei Santhor': ['Srei Santhor', 'Kouk Kandal'],
    'Stueng Trang': ['Stueng Trang', 'Kampong Cham'],
    'Tbong Khmum': ['Tbong Khmum', 'Memot'],
  },
  'Kampong Chhnang': {
    'Kampong Chhnang': ['Kampong Chhnang', 'Chol Kiri', 'Preak Pos'],
    'Baribour': ['Baribour', 'Trang'],
    'Chol Kiri': ['Chol Kiri', 'Kdol Tahen'],
    'Kampong Tralach': ['Kampong Tralach', 'Preak Pos'],
    'Rolea Pa\'em': ['Rolea Pa\'em', 'Trang'],
    'Sameakki Mean Chey': ['Sameakki Mean Chey', 'Kampong Chhnang'],
    'Tuek Phos': ['Tuek Phos', 'Baribour'],
  },
  'Kampong Speu': {
    'Chbar Mon': ['Chbar Mon', 'Thnot', 'Prey Khla'],
    'Basedth': ['Basedth', 'Prey Khla'],
    'Koh Kong': ['Koh Kong', 'Smach Mean Chey'],
    'Kong Pisei': ['Kong Pisei', 'Roka Khpos'],
    'Samraong Tong': ['Samraong Tong', 'Phnom Srouch'],
    'Thpong': ['Thpong', 'Prey Khla'],
    'Oral': ['Oral', 'Phnom Srouch'],
    'Aoral': ['Aoral', 'Thpong'],
  },
  'Kampong Thom': {
    'Stueng Saen': ['Stueng Saen', 'Preak Prasab', 'Rohal'],
    'Baray': ['Baray', 'Preak Prasab'],
    'Kampong Svay': ['Kampong Svay', 'Rohal'],
    'Prasat Balang': ['Prasat Balang', 'Stueng Saen'],
    'Prasat Sambour': ['Prasat Sambour', 'Preak Prasab'],
    'Sandaan': ['Sandaan', 'Rohal'],
    'Sandan': ['Sandan', 'Stueng Saen'],
    'Stoung': ['Stoung', 'Baray'],
  },
  'Kampot': {
    'Krong Kampot': ['Kampong Bay', 'Andoung Khmer', 'Prey Thom'],
    'Angkor Chey': ['Angkor Chey', 'Ta Ngoun'],
    'Banteay Meas': ['Banteay Meas', 'Prey Thom'],
    'Chhouk': ['Chhouk', 'Kampong Trach'],
    'Dang Tong': ['Dang Tong', 'Teuk Chhou'],
    'Kampong Trach': ['Kampong Trach', 'Prey Thom'],
    'Toek Chhou': ['Toek Chhou', 'Kampot'],
  },
  'Kandal': {
    'Ta Khmau': ['Ta Khmau', 'Preaek Anhchanh', 'Cheung Aek'],
    'Ang Snuol': ['Ang Snuol', 'Kouk Khleang'],
    'Kien Svay': ['Kien Svay', 'Preaek Anhchanh'],
    'Leuk Daek': ['Leuk Daek', 'Kouk Khleang'],
    'Lovea Em': ['Lovea Em', 'Preaek Anhchanh'],
    'Muk Kampoul': ['Muk Kampoul', 'Ta Khmau'],
    'Ponhea Lueu': ['Ponhea Lueu', 'Svay Prey'],
    'Saang': ['Saang', 'Cheung Aek'],
    'Khsach Kandal': ['Khsach Kandal', 'Preaek Luong'],
    'Rokas Thom': ['Rokas Thom', 'Samrong Thom'],
    'Takhmau': ['Preaek Anhchanh', 'Cheung Aek', 'Samrong Khnong'],
  },
  'Kep': {
    'Krong Kep': ['Kep', 'Prey Thom'],
    'Damnak Chang\'aeur': ['Damnak Chang\'aeur', 'Kep'],
  },
  'Koh Kong': {
    'Krong Khemarak Phumin': ['Khemarak Phumin', 'Smach Mean Chey'],
    'Botum Sakor': ['Botum Sakor', 'Kaoh Sdach'],
    'Kiri Sakor': ['Kiri Sakor', 'Smach Mean Chey'],
    'Mondol Seima': ['Mondol Seima', 'Kaoh Sdach'],
    'Srae Ambel': ['Srae Ambel', 'Smach Mean Chey'],
    'Thma Bang': ['Thma Bang', 'Botum Sakor'],
  },
  'Kratié': {
    'Krong Kratié': ['Kratié', 'Sambour'],
    'Chhloung': ['Chhloung', 'Krakor'],
    'Preaek Prasab': ['Preaek Prasab', 'Sambour'],
    'Sambour': ['Sambour', 'Kratié'],
    'Snuol': ['Snuol', 'Chhloung'],
  },
  'Mondulkiri': {
    'Saen Monourom': ['Saen Monourom', 'Dak Dam'],
    'Kaev Seima': ['Kaev Seima', 'O\'Reang'],
    'O\'Reang': ['O\'Reang', 'Keo Seima'],
    'Pech Chreada': ['Pech Chreada', 'Dak Dam'],
    'Koh Nhek': ['Koh Nhek', 'Dak Dam'],
  },
  'Oddar Meanchey': {
    'Samraong': ['Samraong', 'Anlong Veng'],
    'Anlong Veng': ['Anlong Veng', 'Trapaing Prasat'],
    'Banteay Ampil': ['Banteay Ampil', 'Samraong'],
    'Chong Kal': ['Chong Kal', 'Anlong Veng'],
    'Trapeang Prasat': ['Trapeang Prasat', 'Samraong'],
  },
  'Pailin': {
    'Krong Pailin': ['Pailin', 'Sala Krau'],
    'Sala Krau': ['Sala Krau', 'Pailin'],
  },
  'Preah Sihanouk': {
    'Krong Preah Sihanouk': ['Buon', 'Mittakpheap', 'Pir', 'Bei', 'Muoy'],
    'Kampong Seila': ['Kampong Seila', 'Mittakpheap'],
    'Prey Nob': ['Prey Nob', 'Buon'],
    'Stueng Hav': ['Stueng Hav', 'Mittakpheap'],
    'Stung Hav': ['Stung Hav', 'Kampong Seila'],
  },
  'Preah Vihear': {
    'Tbeng Meanchey': ['Tbeng Meanchey', 'Rovieng'],
    'Chhaeb': ['Chhaeb', 'Rovieng'],
    'Choam Ksan': ['Choam Ksan', 'Tbeng Meanchey'],
    'Kulen': ['Kulen', 'Rovieng'],
    'Rovieng': ['Rovieng', 'Tbeng Meanchey'],
    'Sangkom Thmei': ['Sangkom Thmei', 'Choam Ksan'],
    'Tbaeng Meanchey': ['Tbaeng Meanchey', 'Rovieng'],
  },
  'Prey Veng': {
    'Prey Veng': ['Prey Veng', 'Kampong Leav'],
    'Ba Phnum': ['Ba Phnum', 'Kampong Leav'],
    'Kamchay Mear': ['Kamchay Mear', 'Prey Veng'],
    'Kampong Trabek': ['Kampong Trabek', 'Kampong Leav'],
    'Kanhchriech': ['Kanhchriech', 'Prey Veng'],
    'Me Sang': ['Me Sang', 'Kampong Trabek'],
    'Pea Reang': ['Pea Reang', 'Kampong Leav'],
    'Preah Sdach': ['Preah Sdach', 'Prey Veng'],
    'Peam Chor': ['Peam Chor', 'Kampong Trabek'],
    'Sithor Kandal': ['Sithor Kandal', 'Prey Veng'],
  },
  'Pursat': {
    'Pursat': ['Pursat', 'Krakor', 'Bakan'],
    'Bakan': ['Bakan', 'Krakor'],
    'Kandieng': ['Kandieng', 'Pursat'],
    'Krakor': ['Krakor', 'Pursat'],
    'Phnum Kravanh': ['Phnum Kravanh', 'Krakor'],
    'Veal Veaeng': ['Veal Veaeng', 'Bakan'],
  },
  'Ratanakiri': {
    'Banlung': ['Banlung', 'Andong Meas'],
    'Andong Meas': ['Andong Meas', 'Banlung'],
    'Bar Kaev': ['Bar Kaev', 'Lumphat'],
    'Kon Mom': ['Kon Mom', 'Andong Meas'],
    'Lumphat': ['Lumphat', 'Banlung'],
    'O\'Chum': ['O\'Chum', 'Andong Meas'],
    'O\'Ya Dav': ['O\'Ya Dav', 'Lumphat'],
    'Voen Sai': ['Voen Sai', 'Andong Meas'],
  },
  'Stung Treng': {
    'Stung Treng': ['Stung Treng', 'Thala Barivat'],
    'Siem Pang': ['Siem Pang', 'Thala Barivat'],
    'Sesan': ['Sesan', 'Stung Treng'],
    'Thala Barivat': ['Thala Barivat', 'Stung Treng'],
  },
  'Svay Rieng': {
    'Svay Rieng': ['Svay Rieng', 'Chantrea'],
    'Chantrea': ['Chantrea', 'Svay Rieng'],
    'Kampong Rou': ['Kampong Rou', 'Svay Rieng'],
    'Romeas Haek': ['Romeas Haek', 'Chantrea'],
    'Svay Chrum': ['Svay Chrum', 'Svay Rieng'],
    'Svay Teab': ['Svay Teab', 'Chantrea'],
  },
  'Takéo': {
    'Krong Doun Kaev': ['Doun Kaev', 'Prey Kabbas'],
    'Ang Roka': ['Ang Roka', 'Prey Kabbas'],
    'Bati': ['Bati', 'Doun Kaev'],
    'Borei Chulsar': ['Borei Chulsar', 'Prey Kabbas'],
    'Kiri Vong': ['Kiri Vong', 'Prey Kabbas'],
    'Kirivong': ['Kirivong', 'Doun Kaev'],
    'Prey Kabbas': ['Prey Kabbas', 'Doun Kaev'],
    'Samraong': ['Samraong', 'Prey Kabbas'],
    'Tram Kak': ['Tram Kak', 'Doun Kaev'],
    'Treang': ['Treang', 'Prey Kabbas'],
  },
  'Tboung Khmum': {
    'Krong Suong': ['Suong', 'Memot'],
    'Dambae': ['Dambae', 'Suong'],
    'Memot': ['Memot', 'Suong'],
    'Ou Reang Ov': ['Ou Reang Ov', 'Memot'],
    'Ponhea Kraek': ['Ponhea Kraek', 'Suong'],
    'Tbong Khmum': ['Tbong Khmum', 'Memot'],
  },
  'Banteay Meanchey': {
    'Krong Serei Saophoan': ['Serei Saophoan', 'Mongkol Borei'],
    'Mongkol Borei': ['Mongkol Borei', 'Serei Saophoan'],
    'Ou Chrov': ['Ou Chrov', 'Serei Saophoan'],
    'Phnum Srok': ['Phnum Srok', 'Mongkol Borei'],
    'Preah Netr Preah': ['Preah Netr Preah', 'Serei Saophoan'],
    'Svay Chek': ['Svay Chek', 'Mongkol Borei'],
    'Thma Puok': ['Thma Puok', 'Serei Saophoan'],
  },
};

// ─── Composable ───────────────────────────────────────────────────────────────
export function useCambodiaLocations(options?: {
  initialProvince?: string;
  initialDistrict?: string;
  initialCommune?: string;
}) {
  const selectedProvince = ref(options?.initialProvince ?? '');
  const selectedDistrict = ref(options?.initialDistrict ?? '');
  const selectedCommune = ref(options?.initialCommune ?? '');

  const provinces = computed(() => Object.keys(CAMBODIA_LOCATIONS).sort());

  const districts = computed(() => {
    if (!selectedProvince.value) return [];
    return Object.keys(CAMBODIA_LOCATIONS[selectedProvince.value] ?? {}).sort();
  });

  const communes = computed(() => {
    if (!selectedProvince.value || !selectedDistrict.value) return [];
    return (CAMBODIA_LOCATIONS[selectedProvince.value]?.[selectedDistrict.value] ?? []).sort();
  });

  // Reset dependent selections when parent changes
  watch(selectedProvince, () => {
    selectedDistrict.value = '';
    selectedCommune.value = '';
  });

  watch(selectedDistrict, () => {
    selectedCommune.value = '';
  });

  const fullAddress = computed(() => {
    const parts = [selectedCommune.value, selectedDistrict.value, selectedProvince.value].filter(Boolean);
    return parts.join(', ');
  });

  return {
    selectedProvince,
    selectedDistrict,
    selectedCommune,
    provinces,
    districts,
    communes,
    fullAddress,
  };
}

// ─── Nominatim Geocoding ──────────────────────────────────────────────────────
// Approximate centre coordinates for each Cambodia province as fallback.
const PROVINCE_COORDS: Record<string, [number, number]> = {
  'Phnom Penh':          [11.5564, 104.9282],
  'Siem Reap':           [13.3671, 103.8448],
  'Battambang':          [13.0957, 103.2022],
  'Kampong Cham':        [12.0000, 105.4500],
  'Kampong Chhnang':     [12.2500, 104.6667],
  'Kampong Speu':        [11.4500, 104.5167],
  'Kampong Thom':        [12.7111, 104.8889],
  'Kampot':              [10.6167, 104.1833],
  'Kandal':              [11.2167, 105.1333],
  'Kep':                 [10.4833, 104.3167],
  'Koh Kong':            [11.6167, 103.0000],
  'Kratié':              [12.4880, 106.0190],
  'Mondulkiri':          [12.4520, 107.1880],
  'Oddar Meanchey':      [14.1600, 103.5000],
  'Pailin':              [12.8500, 102.6000],
  'Preah Sihanouk':      [10.6267, 103.5228],
  'Preah Vihear':        [13.8000, 104.9833],
  'Prey Veng':           [11.4833, 105.3167],
  'Pursat':              [12.5378, 103.9192],
  'Ratanakiri':          [13.7369, 107.0000],
  'Stung Treng':         [13.5259, 105.9686],
  'Svay Rieng':          [11.0833, 105.7997],
  'Takéo':               [10.9833, 104.7833],
  'Tboung Khmum':        [11.9000, 105.6667],
  'Banteay Meanchey':    [13.5167, 103.0667],
};

/**
 * Geocode a Cambodia location using Nominatim (OpenStreetMap).
 * Falls back to province centre coordinates if Nominatim returns nothing.
 */
export async function geocodeLocation(
  province: string,
  district?: string,
  commune?: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!province) return null;

  // Build a query from most-specific to least
  const parts = [commune, district, province, 'Cambodia'].filter(Boolean);
  const query = parts.join(', ');

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=kh`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'FarmLink-App/1.0' },
    });
    const data = await res.json() as Array<{ lat: string; lon: string }>;

    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Nominatim failed — use fallback
  }

  // Fallback: try province-only Nominatim
  if (district || commune) {
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(province + ', Cambodia')}&format=json&limit=1&countrycodes=kh`;
    try {
      const res = await fetch(fallbackUrl, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'FarmLink-App/1.0' },
      });
      const data = await res.json() as Array<{ lat: string; lon: string }>;
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch { /* ignore */ }
  }

  // Last resort: hardcoded province centre
  const coords = PROVINCE_COORDS[province];
  if (coords) return { lat: coords[0], lng: coords[1] };

  return null;
}

/**
 * Compute straight-line distance (km) between two lat/lng points.
 */
export function haversineDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
