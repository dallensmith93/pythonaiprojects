'use client'

import React, { useMemo, useState } from 'react'

import { plannerActions, selectPlannerDerived, usePlannerStore, getSubstitutions } from '../state/plannerStore'

function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

export function MealPlannerPage() {
  const state = usePlannerStore((s) => s)
  const derived = useMemo(() => selectPlannerDerived(state), [state])
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  const selectedDay = state.weeklyPlan.days[selectedDayIndex]
  const selectedMeals =
    selectedDay?.mealIds
      .map((id) => byId(state.mealCatalog, id))
      .filter((meal): meal is NonNullable<typeof meal> => Boolean(meal)) ?? []

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1240 }}>
      <h1>Smart Meal Planner</h1>
      <p>Generate simple low-carb weekly plans with constraint-aware substitutions and shopping list output.</p>

      <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h2>Preferences</h2>
        <label>
          Min Calories
          <input
            type='number'
            value={state.preferences.minCalories}
            onChange={(event) => plannerActions.updatePreferences({ minCalories: Number(event.target.value) })}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Max Calories
          <input
            type='number'
            value={state.preferences.maxCalories}
            onChange={(event) => plannerActions.updatePreferences({ maxCalories: Number(event.target.value) })}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Max Carbs
          <input
            type='number'
            value={state.preferences.maxCarbs}
            onChange={(event) => plannerActions.updatePreferences({ maxCarbs: Number(event.target.value) })}
          />
        </label>
        <label style={{ marginLeft: 8 }}>
          Exclusions (comma)
          <input
            value={state.preferences.exclusions.join(', ')}
            onChange={(event) => {
              const exclusions = event.target.value
                .split(',')
                .map((entry) => entry.trim())
                .filter(Boolean)
              plannerActions.updatePreferences({ exclusions })
            }}
          />
        </label>
        <button type='button' style={{ marginLeft: 8 }} onClick={() => plannerActions.regenerate()}>Regenerate Plan</button>
        <button type='button' style={{ marginLeft: 8 }} onClick={() => plannerActions.resetDefaults()}>Reset Defaults</button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Weekly Planner</h2>
          {state.weeklyPlan.days.map((day, dayIndex) => (
            <article key={day.day} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, marginBottom: 8 }}>
              <button type='button' onClick={() => setSelectedDayIndex(dayIndex)}>
                <strong>{day.day}</strong>
              </button>
              <div>Calories: {day.calories} | Carbs: {day.carbs} | {day.valid ? 'valid' : 'invalid'}</div>
              <div style={{ display: 'grid', gap: 4, marginTop: 6 }}>
                {day.mealIds.map((mealId, slotIndex) => {
                  const meal = byId(state.mealCatalog, mealId)
                  if (!meal) return null

                  const substitutes = getSubstitutions(day, meal.id, state.preferences, state.mealCatalog)
                  return (
                    <div key={`${day.day}-${meal.id}`} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 6 }}>
                      <div><strong>{meal.type}</strong>: {meal.name}</div>
                      <div>{meal.calories} kcal, {meal.carbs}g carbs</div>
                      <button
                        type='button'
                        disabled={slotIndex === 0}
                        onClick={() => plannerActions.moveMeal(dayIndex, slotIndex, slotIndex - 1)}
                      >
                        Move Up
                      </button>
                      <button
                        type='button'
                        disabled={slotIndex === day.mealIds.length - 1}
                        onClick={() => plannerActions.moveMeal(dayIndex, slotIndex, slotIndex + 1)}
                        style={{ marginLeft: 6 }}
                      >
                        Move Down
                      </button>
                      <select
                        style={{ marginLeft: 6 }}
                        onChange={(event) => {
                          if (!event.target.value) return
                          plannerActions.substituteMeal(dayIndex, meal.id, event.target.value)
                        }}
                        value=''
                      >
                        <option value=''>Swap...</option>
                        {substitutes.map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
              <p>{day.reason}</p>
            </article>
          ))}
        </section>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: 12 }}>
          <h2>Recipe View ({selectedDay?.day ?? 'Day'})</h2>
          {selectedMeals.map((meal) => (
            <article key={meal.id} style={{ marginBottom: 8 }}>
              <h3>{meal.name}</h3>
              <ul>
                {meal.recipe.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}

          <h2>Shopping List</h2>
          <ul>
            {derived.shoppingList.map((item) => (
              <li key={item.ingredient}>{item.ingredient} x{item.count}</li>
            ))}
          </ul>

          <h2>Macro Summary</h2>
          <ul>
            {derived.macroSummaries.map((summary) => (
              <li key={summary.day}>{summary.day}: {summary.calories} kcal / {summary.carbs}g carbs [{summary.status}]</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
