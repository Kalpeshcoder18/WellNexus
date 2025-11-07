const Meal = require('../models/Meal');

/**
 * Create meal
 */
exports.addMeal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, calories, protein, carbs, fat, mealType, date, time, source, planned, notes, meta } = req.body;
    if (!name || !date) return res.status(400).json({ message: 'Name and date are required' });
    const meal = new Meal({
      user: userId,
      name,
      calories: Number(calories || 0),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      mealType: mealType || 'snack',
      date: new Date(date),
      time: time || '',
      source: source || 'custom',
      planned: !!planned,
      notes: notes || '',
      meta: meta || {}
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Get meals by date (default today)
 */
exports.getMealsByDate = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dateQ = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(dateQ); start.setHours(0,0,0,0);
    const end = new Date(dateQ); end.setHours(23,59,59,999);
    const meals = await Meal.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ createdAt: 1 });
    res.json({ meals });
  } catch (err) {
    next(err);
  }
};

/**
 * Update meal (only owner)
 */
exports.updateMeal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const allowed = ['name','calories','protein','carbs','fat','mealType','date','time','source','planned','notes','meta'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
    const meal = await Meal.findOneAndUpdate({ _id: id, user: userId }, { $set: updates }, { new: true, runValidators: true });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete meal (only owner)
 */
exports.deleteMeal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const meal = await Meal.findOneAndDelete({ _id: id, user: userId });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Deleted', id: meal._id });
  } catch (err) {
    next(err);
  }
};

/**
 * Get meal analytics over range (7|30 days) - aggregated totals per day
 */
exports.mealsAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const range = Number(req.query.range) || 7;
    const from = new Date(); from.setDate(from.getDate() - (range - 1)); from.setHours(0,0,0,0);
    const agg = await Meal.aggregate([
      { $match: { user: userId, date: { $gte: from } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        calories: { $sum: "$calories" },
        protein: { $sum: "$protein" },
        carbs: { $sum: "$carbs" },
        fat: { $sum: "$fat" },
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    res.json({ range, data: agg });
  } catch (err) {
    next(err);
  }
};
