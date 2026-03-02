import type { Meal } from './constraints'

export const MEAL_CATALOG: Meal[] = [
  {
    id: 'b-egg-spinach',
    name: 'Egg Scramble with Spinach',
    type: 'breakfast',
    calories: 420,
    carbs: 9,
    protein: 28,
    prepMinutes: 12,
    tags: ['low-carb', 'quick', 'vegetarian'],
    ingredients: ['eggs', 'spinach', 'olive oil', 'salt'],
    recipe: ['Whisk eggs.', 'Saute spinach.', 'Cook eggs with spinach.']
  },
  {
    id: 'b-greek-yogurt',
    name: 'Greek Yogurt Nut Bowl',
    type: 'breakfast',
    calories: 390,
    carbs: 14,
    protein: 26,
    prepMinutes: 5,
    tags: ['low-carb', 'quick'],
    ingredients: ['greek yogurt', 'almonds', 'chia', 'berries'],
    recipe: ['Add yogurt to bowl.', 'Top with nuts, chia, and berries.']
  },
  {
    id: 'l-chicken-salad',
    name: 'Chicken Avocado Salad',
    type: 'lunch',
    calories: 610,
    carbs: 13,
    protein: 41,
    prepMinutes: 15,
    tags: ['low-carb', 'simple'],
    ingredients: ['chicken breast', 'avocado', 'greens', 'olive oil'],
    recipe: ['Cook chicken.', 'Slice avocado.', 'Toss with greens and oil.']
  },
  {
    id: 'l-tuna-wrap',
    name: 'Lettuce Tuna Wraps',
    type: 'lunch',
    calories: 520,
    carbs: 10,
    protein: 36,
    prepMinutes: 10,
    tags: ['low-carb', 'quick'],
    ingredients: ['tuna', 'lettuce', 'mayo', 'celery'],
    recipe: ['Mix tuna filling.', 'Wrap in lettuce leaves.']
  },
  {
    id: 'd-salmon-broccoli',
    name: 'Salmon with Roasted Broccoli',
    type: 'dinner',
    calories: 680,
    carbs: 15,
    protein: 44,
    prepMinutes: 25,
    tags: ['low-carb', 'simple'],
    ingredients: ['salmon', 'broccoli', 'olive oil', 'garlic'],
    recipe: ['Season salmon.', 'Roast broccoli.', 'Bake salmon until done.']
  },
  {
    id: 'd-turkey-zucchini',
    name: 'Turkey Zucchini Skillet',
    type: 'dinner',
    calories: 640,
    carbs: 14,
    protein: 42,
    prepMinutes: 20,
    tags: ['low-carb', 'simple'],
    ingredients: ['ground turkey', 'zucchini', 'tomato paste', 'onion'],
    recipe: ['Brown turkey.', 'Add vegetables.', 'Simmer with seasoning.']
  }
]
