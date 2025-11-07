export interface Supplement {
  id: string;
  name: string;
  category: 'vitamins' | 'minerals' | 'protein' | 'herbal' | 'omega' | 'probiotics' | 'performance' | 'general';
  description: string;
  benefits: string[];
  dosage: string;
  price: number;
  imageUrl: string;
  buyLink: string;
  supplier: string;
  contraindications: string[];
  recommendedFor: {
    conditions: string[];
    medications: string[];
  };
  warnings: string[];
  rating: number;
  reviews: number;
}

export const supplementsData: Supplement[] = [
  // Vitamins
  {
    id: 'vit-d3-1',
    name: 'Vitamin D3 5000 IU',
    category: 'vitamins',
    description: 'High-potency vitamin D3 for bone health and immune support',
    benefits: ['Supports bone health', 'Boosts immune system', 'Improves mood', 'Enhances calcium absorption'],
    dosage: '1 softgel daily with food',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    buyLink: 'https://www.amazon.com/dp/B00GB85JR4',
    supplier: 'NOW Foods',
    contraindications: ['Hypercalcemia', 'Kidney stones'],
    recommendedFor: {
      conditions: ['Vitamin D deficiency', 'Osteoporosis', 'Depression', 'Immune disorders'],
      medications: []
    },
    warnings: ['Consult doctor if taking blood thinners', 'May interact with certain medications'],
    rating: 4.7,
    reviews: 15420
  },
  {
    id: 'vit-b12-1',
    name: 'Vitamin B12 Methylcobalamin',
    category: 'vitamins',
    description: 'Active form of B12 for energy and nervous system support',
    benefits: ['Boosts energy levels', 'Supports nerve function', 'Improves cognitive function', 'Aids red blood cell formation'],
    dosage: '1 tablet daily, dissolve under tongue',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-4e6c9609e5c3?w=400',
    buyLink: 'https://www.amazon.com/dp/B003OD9160',
    supplier: 'Jarrow Formulas',
    contraindications: ['Leber\'s disease'],
    recommendedFor: {
      conditions: ['Pernicious anemia', 'Fatigue', 'Vegan/vegetarian diet', 'Nerve damage'],
      medications: ['Metformin']
    },
    warnings: ['May interact with certain antibiotics', 'Consult doctor if pregnant'],
    rating: 4.6,
    reviews: 8932
  },
  {
    id: 'vit-c-1',
    name: 'Vitamin C 1000mg',
    category: 'vitamins',
    description: 'Immune-boosting vitamin C with rose hips',
    benefits: ['Strengthens immune system', 'Powerful antioxidant', 'Supports collagen production', 'Aids wound healing'],
    dosage: '1-2 tablets daily with meals',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    buyLink: 'https://www.amazon.com/dp/B00028OVXM',
    supplier: 'Nature Made',
    contraindications: ['Kidney stones', 'Hemochromatosis'],
    recommendedFor: {
      conditions: ['Weak immune system', 'Scurvy', 'Common cold', 'Wound healing'],
      medications: []
    },
    warnings: ['High doses may cause digestive upset', 'May interact with chemotherapy'],
    rating: 4.5,
    reviews: 12304
  },

  // Minerals
  {
    id: 'mag-1',
    name: 'Magnesium Glycinate 400mg',
    category: 'minerals',
    description: 'Highly absorbable magnesium for muscle and sleep support',
    benefits: ['Promotes relaxation', 'Supports muscle function', 'Improves sleep quality', 'Maintains heart health'],
    dosage: '2 capsules daily, preferably before bed',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400',
    buyLink: 'https://www.amazon.com/dp/B07PYYQFKD',
    supplier: 'Doctor\'s Best',
    contraindications: ['Kidney disease', 'Heart block'],
    recommendedFor: {
      conditions: ['Insomnia', 'Anxiety', 'Muscle cramps', 'Migraines', 'Hypertension'],
      medications: []
    },
    warnings: ['May cause diarrhea at high doses', 'Consult doctor if on blood pressure medication'],
    rating: 4.8,
    reviews: 19847
  },
  {
    id: 'zinc-1',
    name: 'Zinc Picolinate 50mg',
    category: 'minerals',
    description: 'Essential mineral for immune function and wound healing',
    benefits: ['Boosts immune system', 'Supports wound healing', 'Maintains healthy skin', 'Aids reproductive health'],
    dosage: '1 capsule daily with food',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400',
    buyLink: 'https://www.amazon.com/dp/B0013OQGO6',
    supplier: 'NOW Foods',
    contraindications: ['Wilson\'s disease'],
    recommendedFor: {
      conditions: ['Zinc deficiency', 'Immune disorders', 'Acne', 'Age-related macular degeneration'],
      medications: []
    },
    warnings: ['May cause nausea if taken on empty stomach', 'Do not exceed recommended dose'],
    rating: 4.6,
    reviews: 7654
  },

  // Omega Fatty Acids
  {
    id: 'omega-1',
    name: 'Omega-3 Fish Oil 2000mg',
    category: 'omega',
    description: 'High-potency EPA and DHA for heart and brain health',
    benefits: ['Supports heart health', 'Improves brain function', 'Reduces inflammation', 'Supports eye health'],
    dosage: '2 softgels daily with meals',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
    buyLink: 'https://www.amazon.com/dp/B00CAZAU62',
    supplier: 'Nordic Naturals',
    contraindications: ['Seafood allergy', 'Bleeding disorders'],
    recommendedFor: {
      conditions: ['High cholesterol', 'Heart disease', 'Depression', 'Arthritis', 'ADHD'],
      medications: []
    },
    warnings: ['May increase bleeding risk with blood thinners', 'Keep refrigerated'],
    rating: 4.7,
    reviews: 23456
  },

  // Probiotics
  {
    id: 'prob-1',
    name: 'Probiotic 50 Billion CFU',
    category: 'probiotics',
    description: 'Multi-strain probiotic for digestive and immune health',
    benefits: ['Supports digestive health', 'Boosts immune function', 'Maintains gut flora', 'Reduces bloating'],
    dosage: '1 capsule daily on empty stomach',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    buyLink: 'https://www.amazon.com/dp/B00JEKYNZA',
    supplier: 'Garden of Life',
    contraindications: ['Immunocompromised conditions', 'Short bowel syndrome'],
    recommendedFor: {
      conditions: ['IBS', 'Digestive issues', 'Antibiotic use', 'Bloating', 'Weak immune system'],
      medications: ['Antibiotics']
    },
    warnings: ['May cause gas initially', 'Keep refrigerated for best results'],
    rating: 4.6,
    reviews: 18932
  },

  // Protein & Performance
  {
    id: 'prot-1',
    name: 'Whey Protein Isolate',
    category: 'protein',
    description: 'Pure whey protein isolate for muscle building and recovery',
    benefits: ['Builds lean muscle', 'Aids muscle recovery', 'Supports weight management', 'High protein content'],
    dosage: '1-2 scoops post-workout or between meals',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400',
    buyLink: 'https://www.amazon.com/dp/B002DYJ0N8',
    supplier: 'Optimum Nutrition',
    contraindications: ['Milk allergy', 'Lactose intolerance'],
    recommendedFor: {
      conditions: ['Muscle building', 'Athletic performance', 'Weight loss', 'Recovery'],
      medications: []
    },
    warnings: ['May cause digestive issues in lactose intolerant individuals'],
    rating: 4.8,
    reviews: 45623
  },
  {
    id: 'creat-1',
    name: 'Creatine Monohydrate',
    category: 'performance',
    description: 'Micronized creatine for strength and performance',
    benefits: ['Increases strength', 'Enhances muscle growth', 'Improves high-intensity performance', 'Supports brain health'],
    dosage: '5g daily, any time of day',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400',
    buyLink: 'https://www.amazon.com/dp/B002DYIZEO',
    supplier: 'Optimum Nutrition',
    contraindications: ['Kidney disease'],
    recommendedFor: {
      conditions: ['Athletic performance', 'Muscle building', 'Strength training'],
      medications: []
    },
    warnings: ['Drink plenty of water', 'May cause water retention'],
    rating: 4.7,
    reviews: 28934
  },

  // Herbal Supplements
  {
    id: 'ashwa-1',
    name: 'Ashwagandha 1300mg',
    category: 'herbal',
    description: 'Adaptogenic herb for stress relief and vitality',
    benefits: ['Reduces stress and anxiety', 'Improves energy', 'Supports thyroid function', 'Enhances cognitive function'],
    dosage: '2 capsules daily with meals',
    price: 17.99,
    imageUrl: 'https://images.unsplash.com/photo-1599629954294-1c71bd0e8b42?w=400',
    buyLink: 'https://www.amazon.com/dp/B07SHVMR1J',
    supplier: 'Goli Nutrition',
    contraindications: ['Thyroid disorders', 'Autoimmune conditions', 'Pregnancy'],
    recommendedFor: {
      conditions: ['Stress', 'Anxiety', 'Fatigue', 'Low thyroid', 'Insomnia'],
      medications: ['Thyroid medications']
    },
    warnings: ['May interact with thyroid medication', 'Avoid during pregnancy'],
    rating: 4.5,
    reviews: 16543
  },
  {
    id: 'turmeric-1',
    name: 'Turmeric Curcumin 1500mg',
    category: 'herbal',
    description: 'Anti-inflammatory turmeric with black pepper extract',
    benefits: ['Powerful anti-inflammatory', 'Antioxidant properties', 'Supports joint health', 'Promotes brain health'],
    dosage: '2 capsules daily with meals',
    price: 22.99,
    imageUrl: 'https://images.unsplash.com/photo-1615485500834-bc10199bc964?w=400',
    buyLink: 'https://www.amazon.com/dp/B019ET7PW6',
    supplier: 'BioSchwartz',
    contraindications: ['Gallbladder problems', 'Bleeding disorders'],
    recommendedFor: {
      conditions: ['Arthritis', 'Inflammation', 'Joint pain', 'Digestive issues'],
      medications: []
    },
    warnings: ['May increase bleeding risk', 'Consult doctor if taking blood thinners'],
    rating: 4.6,
    reviews: 21087
  },
  {
    id: 'collagen-1',
    name: 'Collagen Peptides',
    category: 'general',
    description: 'Grass-fed collagen for skin, hair, and joint health',
    benefits: ['Improves skin elasticity', 'Strengthens hair and nails', 'Supports joint health', 'Aids gut health'],
    dosage: '1-2 scoops daily in beverage',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
    buyLink: 'https://www.amazon.com/dp/B00K3P3R5U',
    supplier: 'Vital Proteins',
    contraindications: ['Beef allergy'],
    recommendedFor: {
      conditions: ['Aging skin', 'Joint pain', 'Hair loss', 'Brittle nails'],
      medications: []
    },
    warnings: ['May cause digestive upset in some individuals'],
    rating: 4.7,
    reviews: 34521
  },
  {
    id: 'iron-1',
    name: 'Iron Bisglycinate 25mg',
    category: 'minerals',
    description: 'Gentle iron supplement for energy and red blood cell production',
    benefits: ['Prevents iron deficiency', 'Boosts energy', 'Supports healthy pregnancy', 'Improves cognitive function'],
    dosage: '1 capsule daily with vitamin C',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1614267861403-39b9ceaaa39d?w=400',
    buyLink: 'https://www.amazon.com/dp/B000FGQWU8',
    supplier: 'Thorne',
    contraindications: ['Hemochromatosis', 'Hemosiderosis'],
    recommendedFor: {
      conditions: ['Iron deficiency anemia', 'Fatigue', 'Pregnancy', 'Heavy menstruation'],
      medications: []
    },
    warnings: ['Keep away from children', 'May cause constipation'],
    rating: 4.5,
    reviews: 9876
  },
  {
    id: 'coq10-1',
    name: 'CoQ10 200mg',
    category: 'general',
    description: 'Powerful antioxidant for heart and cellular energy',
    benefits: ['Supports heart health', 'Boosts cellular energy', 'Powerful antioxidant', 'May reduce migraines'],
    dosage: '1 softgel daily with fat-containing meal',
    price: 27.99,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400',
    buyLink: 'https://www.amazon.com/dp/B000I6MVLG',
    supplier: 'Qunol',
    contraindications: ['Surgery (stop 2 weeks prior)'],
    recommendedFor: {
      conditions: ['Heart disease', 'High blood pressure', 'Migraines', 'Statin use'],
      medications: ['Statins', 'Blood pressure medications']
    },
    warnings: ['May interact with blood thinners', 'Consult doctor if on medication'],
    rating: 4.6,
    reviews: 14320
  },
  {
    id: 'fiber-1',
    name: 'Psyllium Husk Fiber',
    category: 'general',
    description: 'Natural fiber supplement for digestive health',
    benefits: ['Promotes regularity', 'Supports heart health', 'Helps control blood sugar', 'Aids weight management'],
    dosage: '1 tablespoon in water, 1-2 times daily',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1628191010210-a59de3fc4cbe?w=400',
    buyLink: 'https://www.amazon.com/dp/B0013OXKHC',
    supplier: 'Metamucil',
    contraindications: ['Bowel obstruction', 'Difficulty swallowing'],
    recommendedFor: {
      conditions: ['Constipation', 'IBS', 'High cholesterol', 'Diabetes'],
      medications: []
    },
    warnings: ['Drink plenty of water', 'Take 2 hours apart from medications'],
    rating: 4.5,
    reviews: 11234
  }
];

export const medicalConditionsList = [
  'Vitamin D deficiency',
  'Osteoporosis',
  'Depression',
  'Immune disorders',
  'Pernicious anemia',
  'Fatigue',
  'Vegan/vegetarian diet',
  'Nerve damage',
  'Weak immune system',
  'Scurvy',
  'Common cold',
  'Insomnia',
  'Anxiety',
  'Muscle cramps',
  'Migraines',
  'Hypertension',
  'Zinc deficiency',
  'Acne',
  'Age-related macular degeneration',
  'High cholesterol',
  'Heart disease',
  'Arthritis',
  'ADHD',
  'IBS',
  'Digestive issues',
  'Bloating',
  'Muscle building',
  'Athletic performance',
  'Weight loss',
  'Stress',
  'Low thyroid',
  'Inflammation',
  'Joint pain',
  'Aging skin',
  'Hair loss',
  'Brittle nails',
  'Iron deficiency anemia',
  'Pregnancy',
  'Heavy menstruation',
  'Constipation',
  'Diabetes'
];

export const medicationsList = [
  'Metformin',
  'Blood thinners',
  'Antibiotics',
  'Thyroid medications',
  'Statins',
  'Blood pressure medications',
  'Chemotherapy',
  'Immunosuppressants',
  'Antidepressants',
  'Pain relievers'
];
