const mockProducts = [
  // ================= CATEGORY: THERMOMETERS =================
  {
    id: 1,
    name: "Braun ThermoScan 7 Digital Ear Thermometer",
    category: "Thermometers",
    price: 45.99,
    originalPrice: 59.99,
    discountPercentage: 23,
    reviewCount: 1245,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "iHealth No-Touch Forehead Thermometer",
    category: "Thermometers",
    price: 24.5,
    originalPrice: 29.99,
    discountPercentage: 18,
    reviewCount: 856,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Vicks SpeedRead Digital Thermometer",
    category: "Thermometers",
    price: 12.99,
    originalPrice: 15.0,
    discountPercentage: 13,
    reviewCount: 312,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1584308666744-24d5e4a819b1?auto=format&fit=crop&q=80&w=400",
  },

  // ================= CATEGORY: BP MONITORS =================
  {
    id: 4,
    name: "Omron Platinum Blood Pressure Monitor",
    category: "BP Monitors",
    price: 75.0,
    originalPrice: 90.0,
    discountPercentage: 16,
    reviewCount: 2154,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    name: "Withings BPM Connect Smart Blood Pressure",
    category: "BP Monitors",
    price: 99.95,
    originalPrice: 129.95,
    discountPercentage: 23,
    reviewCount: 432,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    name: "GreaterGoods Bluetooth Blood Pressure Monitor",
    category: "BP Monitors",
    price: 49.0,
    originalPrice: 65.0,
    discountPercentage: 24,
    reviewCount: 678,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1551076805-e1869043e560?auto=format&fit=crop&q=80&w=400",
  },

  // ================= CATEGORY: OXIMETERS =================
  {
    id: 7,
    name: "Innova Pulse Oximeter Fingertip",
    category: "Oximeters",
    price: 18.99,
    originalPrice: 25.0,
    discountPercentage: 24,
    reviewCount: 3412,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 8,
    name: "Zacurate Pro Series 500DL Fingertip Oximeter",
    category: "Oximeters",
    price: 22.5,
    originalPrice: 30.0,
    discountPercentage: 25,
    reviewCount: 1540,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
  },

  // ================= CATEGORY: PERSONAL CARE =================
  {
    id: 9,
    name: "VitaLife Omega-3 Fish Oil Softgels",
    category: "Personal Care",
    price: 27.49,
    originalPrice: 39.99,
    discountPercentage: 31,
    reviewCount: 189,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 10,
    name: "CeraVe Hydrating Facial Cleanser 16 oz",
    category: "Personal Care",
    price: 15.49,
    originalPrice: 18.99,
    discountPercentage: 18,
    reviewCount: 8902,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 11,
    name: "Nature's Bounty Zinc Gummies 50mg",
    category: "Personal Care",
    price: 9.99,
    originalPrice: 12.5,
    discountPercentage: 20,
    reviewCount: 432,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 12,
    name: "La Roche-Posay Anthelios Melt-in Milk Sunscreen",
    category: "Personal Care",
    price: 35.99,
    originalPrice: 39.99,
    discountPercentage: 10,
    reviewCount: 1250,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1556228720-192a6af4e86e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 13,
    name: "Purell Advanced Hand Sanitizer Gel",
    category: "Personal Care",
    price: 8.5,
    originalPrice: 10.0,
    discountPercentage: 15,
    reviewCount: 765,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 14,
    name: "Cetaphil Daily Facial Cleanser",
    category: "Personal Care",
    price: 14.0,
    originalPrice: 17.5,
    discountPercentage: 20,
    reviewCount: 5632,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 15,
    name: "OLLY Daily Energy Gummy Supplements",
    category: "Personal Care",
    price: 13.99,
    originalPrice: 15.99,
    discountPercentage: 12,
    reviewCount: 892,
    rating: 4,
    image_url:
      "https://images.unsplash.com/photo-1550572017-edb41dfb37c0?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 16,
    name: "Tylenol Extra Strength Caplets - 500mg",
    category: "Personal Care",
    price: 11.49,
    originalPrice: 14.99,
    discountPercentage: 23,
    reviewCount: 10245,
    rating: 5,
    image_url:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400",
  },
];

export default mockProducts;
