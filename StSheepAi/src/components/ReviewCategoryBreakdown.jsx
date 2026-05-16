import {
  categoryDescriptions,
  categoryLabels,
  positiveCategories,
  warningCategories,
} from '../lib/reviewCategories'

function ReviewCategoryBreakdown({ categoryCounts }) {
  const maxCount = Math.max(1, ...Object.values(categoryCounts))

  return (
    <section className="breakdown-panel" aria-labelledby="category-breakdown-title">
      <div className="section-heading">
        <p className="eyebrow">Review categories</p>
        <h2 id="category-breakdown-title">Category Breakdown</h2>
      </div>

      <CategoryGroup
        title="Positive"
        categories={positiveCategories}
        categoryCounts={categoryCounts}
        maxCount={maxCount}
      />
      <CategoryGroup
        title="Warnings"
        categories={warningCategories}
        categoryCounts={categoryCounts}
        maxCount={maxCount}
      />
    </section>
  )
}

function CategoryGroup({ title, categories, categoryCounts, maxCount }) {
  return (
    <div className="category-group">
      <h3>{title}</h3>
      <div className="category-list">
        {categories.map((category) => {
          const count = categoryCounts[category] ?? 0
          const width = `${Math.max(5, (count / maxCount) * 100)}%`

          return (
            <article className="category-row" key={category}>
              <div className="category-row-top">
                <div>
                  <strong>{categoryLabels[category]}</strong>
                  <p>{categoryDescriptions[category]}</p>
                </div>
                <span>{count}</span>
              </div>
              <div className="bar-track" aria-hidden="true">
                <div className="bar-fill" style={{ width }} />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default ReviewCategoryBreakdown

