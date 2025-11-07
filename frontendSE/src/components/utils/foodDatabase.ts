export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const foodDatabase = {
  breakfast: [
    { name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 54, fat: 8 },
    { name: 'Greek Yogurt Parfait', calories: 280, protein: 20, carbs: 35, fat: 6 },
    { name: 'Scrambled Eggs with Toast', calories: 350, protein: 18, carbs: 28, fat: 16 },
    { name: 'Protein Smoothie Bowl', calories: 380, protein: 25, carbs: 45, fat: 10 },
    { name: 'Avocado Toast', calories: 340, protein: 10, carbs: 38, fat: 18 },
    { name: 'Pancakes with Syrup', calories: 450, protein: 8, carbs: 72, fat: 14 },
    { name: 'Breakfast Burrito', calories: 520, protein: 22, carbs: 48, fat: 26 },
    { name: 'Fruit and Nut Granola', calories: 360, protein: 10, carbs: 52, fat: 14 },
  ],
  lunch: [
    { name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 25, fat: 18 },
    { name: 'Quinoa Buddha Bowl', calories: 480, protein: 18, carbs: 62, fat: 16 },
    { name: 'Turkey Wrap', calories: 450, protein: 28, carbs: 42, fat: 16 },
    { name: 'Salmon with Vegetables', calories: 520, protein: 38, carbs: 32, fat: 24 },
    { name: 'Lentil Soup with Bread', calories: 390, protein: 20, carbs: 58, fat: 8 },
    { name: 'Chicken Caesar Salad', calories: 460, protein: 32, carbs: 28, fat: 22 },
    { name: 'Veggie Burger with Fries', calories: 580, protein: 18, carbs: 68, fat: 26 },
    { name: 'Tuna Sandwich', calories: 380, protein: 26, carbs: 42, fat: 12 },
  ],
  dinner: [
    { name: 'Grilled Steak with Sweet Potato', calories: 580, protein: 42, carbs: 48, fat: 20 },
    { name: 'Baked Cod with Rice', calories: 520, protein: 38, carbs: 55, fat: 12 },
    { name: 'Chicken Stir Fry', calories: 490, protein: 36, carbs: 52, fat: 14 },
    { name: 'Vegetarian Pasta', calories: 550, protein: 22, carbs: 72, fat: 16 },
    { name: 'Tofu Curry with Rice', calories: 480, protein: 24, carbs: 58, fat: 18 },
    { name: 'Beef Tacos', calories: 620, protein: 34, carbs: 52, fat: 28 },
    { name: 'Shrimp Pad Thai', calories: 540, protein: 28, carbs: 64, fat: 18 },
    { name: 'BBQ Chicken Pizza', calories: 680, protein: 36, carbs: 72, fat: 26 },
  ],
  snacks: [
    { name: 'Apple with Almond Butter', calories: 180, protein: 6, carbs: 18, fat: 10 },
    { name: 'Protein Bar', calories: 200, protein: 15, carbs: 20, fat: 8 },
    { name: 'Mixed Nuts', calories: 160, protein: 6, carbs: 8, fat: 14 },
    { name: 'Hummus with Veggies', calories: 140, protein: 5, carbs: 16, fat: 6 },
    { name: 'Cottage Cheese with Fruit', calories: 150, protein: 14, carbs: 18, fat: 3 },
    { name: 'Trail Mix', calories: 180, protein: 5, carbs: 22, fat: 9 },
    { name: 'Protein Shake', calories: 220, protein: 24, carbs: 18, fat: 6 },
    { name: 'Rice Cakes with Peanut Butter', calories: 190, protein: 8, carbs: 24, fat: 8 },
  ],
};

export type MealType = keyof typeof foodDatabase;

export function getAllFoods(): FoodItem[] {
  return [
    ...foodDatabase.breakfast,
    ...foodDatabase.lunch,
    ...foodDatabase.dinner,
    ...foodDatabase.snacks,
  ];
}

export function searchFoods(query: string): FoodItem[] {
  const allFoods = getAllFoods();
  const lowerQuery = query.toLowerCase();
  return allFoods.filter((food) =>
    food.name.toLowerCase().includes(lowerQuery)
  );
}
