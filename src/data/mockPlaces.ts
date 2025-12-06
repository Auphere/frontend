import { Place, EveningPlan } from "@/types/place";

export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "La Dolce Vita",
    category: "restaurant",
    description: "Authentic Italian cuisine with a romantic atmosphere and live piano music",
    vibe: ["romantic", "sophisticated"],
    crowdLevel: "moderate",
    musicType: "live",
    priceLevel: 3,
    rating: 4.6,
    reviewCount: 342,
    address: "Calle del Prado, 28",
    neighborhood: "Centro",
    distance: 1.2,
    openNow: true,
    openingHours: "12:00 - 00:00",
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de"
    ],
    features: ["Outdoor seating", "Wine selection", "Reservations recommended"],
    currentStatus: "Perfect for a romantic dinner tonight",
    googleRating: 4.7,
    googleReviewCount: 342,
    trustpilotRating: 4.5,
    trustpilotReviewCount: 128,
    phone: "+34 976 123 456",
    website: "https://ladolcevita.example.com",
    email: "info@ladolcevita.example.com",
    socialMedia: {
      instagram: "@ladolcevitazgz",
      facebook: "ladolcevitazaragoza"
    },
    amenities: ["WiFi", "Wheelchair Accessible", "Outdoor Seating", "Reservations", "Card Payments", "Wine Bar"],
    weeklyHours: {
      Monday: "12:00 - 23:30",
      Tuesday: "12:00 - 23:30",
      Wednesday: "12:00 - 23:30",
      Thursday: "12:00 - 00:00",
      Friday: "12:00 - 01:00",
      Saturday: "12:00 - 01:00",
      Sunday: "12:00 - 23:30"
    },
    parkingInfo: "Street parking available nearby",
    publicTransport: "Bus lines 22, 23 - 2 min walk",
    popularTimes: {
      "12:00": 30, "13:00": 65, "14:00": 85, "15:00": 70, "16:00": 40,
      "17:00": 25, "18:00": 20, "19:00": 45, "20:00": 75, "21:00": 90,
      "22:00": 85, "23:00": 60
    },
    reviews: [
      {
        id: "r1",
        author: "María González",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely wonderful! The pasta was fresh and the ambiance perfect for our anniversary dinner. Highly recommend the tiramisu!",
        helpful: 12
      },
      {
        id: "r2",
        author: "John Smith",
        rating: 4,
        date: "2024-01-10",
        comment: "Great food and service. The live piano music created a lovely atmosphere. Only downside was it was quite busy.",
        helpful: 8
      },
      {
        id: "r3",
        author: "Carmen López",
        rating: 5,
        date: "2024-01-05",
        comment: "Best Italian restaurant in Zaragoza! The wine selection is impressive and staff very knowledgeable.",
        helpful: 15
      }
    ]
  },
  {
    id: "2",
    name: "El Barrio Social",
    category: "bar",
    description: "Trendy cocktail bar with craft drinks and vibrant atmosphere",
    vibe: ["energetic", "fun"],
    crowdLevel: "busy",
    musicType: "dj",
    priceLevel: 2,
    rating: 4.4,
    reviewCount: 578,
    address: "Avenida de la Independencia, 15",
    neighborhood: "El Tubo",
    distance: 0.8,
    openNow: true,
    openingHours: "18:00 - 03:00",
    images: ["https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2"],
    features: ["Craft cocktails", "Happy hour", "DJ sets"],
    currentStatus: "Getting lively - great energy right now"
  },
  {
    id: "3",
    name: "Café Lumière",
    category: "cafe",
    description: "Cozy café perfect for brunch or afternoon coffee with friends",
    vibe: ["chill", "casual"],
    crowdLevel: "quiet",
    musicType: "ambient",
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 234,
    address: "Plaza del Pilar, 8",
    neighborhood: "Casco Histórico",
    distance: 0.5,
    openNow: true,
    openingHours: "08:00 - 21:00",
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24"],
    features: ["WiFi", "Specialty coffee", "Pastries"],
    currentStatus: "Peaceful atmosphere, perfect for working or chatting"
  },
  {
    id: "4",
    name: "Neon Nights",
    category: "club",
    description: "High-energy nightclub with top DJs and electronic music",
    vibe: ["energetic"],
    crowdLevel: "packed",
    musicType: "electronic",
    priceLevel: 3,
    rating: 4.3,
    reviewCount: 892,
    address: "Calle de San Vicente de Paúl, 45",
    neighborhood: "Universidad",
    distance: 2.1,
    openNow: true,
    openingHours: "23:00 - 06:00",
    images: ["https://images.unsplash.com/photo-1566737236500-c8ac43014a67"],
    features: ["VIP area", "International DJs", "Late night"],
    currentStatus: "Peak hours - dance floor is full!"
  },
  {
    id: "5",
    name: "The Garden Lounge",
    category: "lounge",
    description: "Elegant rooftop lounge with garden views and sophisticated cocktails",
    vibe: ["sophisticated", "chill"],
    crowdLevel: "moderate",
    musicType: "jazz",
    priceLevel: 4,
    rating: 4.7,
    reviewCount: 445,
    address: "Gran Vía, 102",
    neighborhood: "Centro",
    distance: 1.5,
    openNow: true,
    openingHours: "17:00 - 02:00",
    images: ["https://images.unsplash.com/photo-1470337458703-46ad1756a187"],
    features: ["Rooftop", "City views", "Premium cocktails"],
    currentStatus: "Relaxed elegance - perfect for evening drinks"
  },
  {
    id: "6",
    name: "Tapas y Más",
    category: "restaurant",
    description: "Traditional Spanish tapas with modern twist in a casual setting",
    vibe: ["casual", "fun"],
    crowdLevel: "busy",
    musicType: "ambient",
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 623,
    address: "Calle de Alfonso I, 22",
    neighborhood: "El Tubo",
    distance: 0.6,
    openNow: true,
    openingHours: "13:00 - 23:30",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
      "https://images.unsplash.com/photo-1544025162-d76694265947"
    ],
    features: ["Sharing plates", "Local wines", "Outdoor seating"],
    currentStatus: "Buzzing with locals - authentic vibe",
    googleRating: 4.6,
    googleReviewCount: 623,
    trustpilotRating: 4.4,
    trustpilotReviewCount: 201,
    phone: "+34 976 234 567",
    website: "https://tapasymas.example.com",
    email: "hola@tapasymas.example.com",
    socialMedia: {
      instagram: "@tapasymas_zgz",
      facebook: "tapasymasZaragoza"
    },
    amenities: ["WiFi", "Outdoor Seating", "Card Payments", "Family Friendly", "Local Wine"],
    weeklyHours: {
      Monday: "13:00 - 23:30",
      Tuesday: "13:00 - 23:30",
      Wednesday: "13:00 - 23:30",
      Thursday: "13:00 - 23:30",
      Friday: "13:00 - 00:30",
      Saturday: "13:00 - 00:30",
      Sunday: "13:00 - 23:00"
    },
    parkingInfo: "Public parking 3 min walk",
    publicTransport: "Metro San Francisco - 5 min walk",
    popularTimes: {
      "13:00": 60, "14:00": 90, "15:00": 85, "16:00": 50, "17:00": 30,
      "18:00": 25, "19:00": 40, "20:00": 70, "21:00": 85, "22:00": 80, "23:00": 55
    },
    reviews: [
      {
        id: "r7",
        author: "Pedro Martínez",
        rating: 5,
        date: "2024-01-18",
        comment: "Fantastic tapas! The patatas bravas are the best I've had. Great value for money and friendly staff.",
        helpful: 20
      },
      {
        id: "r8",
        author: "Sarah Johnson",
        rating: 4,
        date: "2024-01-12",
        comment: "Authentic Spanish experience. The outdoor seating is lovely. Can get crowded during peak hours.",
        helpful: 14
      },
      {
        id: "r9",
        author: "Luis García",
        rating: 5,
        date: "2024-01-08",
        comment: "Local gem! Perfect for sharing with friends. The wine selection showcases great local options.",
        helpful: 18
      }
    ]
  },
  {
    id: "7",
    name: "Jazz & Wine",
    category: "bar",
    description: "Intimate jazz bar with curated wine selection and live performances",
    vibe: ["romantic", "sophisticated"],
    crowdLevel: "quiet",
    musicType: "jazz",
    priceLevel: 3,
    rating: 4.6,
    reviewCount: 312,
    address: "Calle de Heroísmo, 7",
    neighborhood: "Romareda",
    distance: 2.8,
    openNow: true,
    openingHours: "19:00 - 02:00",
    images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b"],
    features: ["Live jazz", "Wine tastings", "Intimate setting"],
    currentStatus: "Smooth jazz playing - perfect date spot"
  },
  {
    id: "8",
    name: "Street Food Market",
    category: "activity",
    description: "Vibrant food market with international street food and live entertainment",
    vibe: ["casual", "fun", "energetic"],
    crowdLevel: "busy",
    musicType: "live",
    priceLevel: 2,
    rating: 4.4,
    reviewCount: 756,
    address: "Parque del Agua, s/n",
    neighborhood: "Actur",
    distance: 3.5,
    openNow: true,
    openingHours: "12:00 - 00:00",
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1"],
    features: ["Variety", "Outdoor", "Family-friendly"],
    currentStatus: "Lively market atmosphere - great for groups"
  }
];

export const mockEveningPlans: EveningPlan[] = [
  {
    id: "plan-1",
    name: "Romantic Evening",
    description: "Perfect date night with dinner, drinks, and ambiance",
    stops: [
      {
        place: mockPlaces[0],
        duration: 120,
        startTime: "20:00",
        activity: "Dinner at Italian restaurant"
      },
      {
        place: mockPlaces[6],
        duration: 90,
        startTime: "22:15",
        activity: "Jazz and wine"
      }
    ],
    totalDuration: 225,
    totalDistance: 2.5,
    vibe: "romantic"
  },
  {
    id: "plan-2",
    name: "Night Out with Friends",
    description: "Energetic night: tapas, cocktails, and dancing",
    stops: [
      {
        place: mockPlaces[5],
        duration: 90,
        startTime: "20:00",
        activity: "Tapas dinner"
      },
      {
        place: mockPlaces[1],
        duration: 120,
        startTime: "21:45",
        activity: "Cocktails and socializing"
      },
      {
        place: mockPlaces[3],
        duration: 150,
        startTime: "00:00",
        activity: "Dancing and partying"
      }
    ],
    totalDuration: 360,
    totalDistance: 3.2,
    vibe: "energetic"
  },
  {
    id: "plan-3",
    name: "Sophisticated Evening",
    description: "Classy night with rooftop drinks and fine dining",
    stops: [
      {
        place: mockPlaces[4],
        duration: 90,
        startTime: "19:00",
        activity: "Sunset cocktails"
      },
      {
        place: mockPlaces[0],
        duration: 120,
        startTime: "20:45",
        activity: "Fine dining"
      }
    ],
    totalDuration: 225,
    totalDistance: 1.8,
    vibe: "sophisticated"
  }
];
