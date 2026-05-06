export const quantityOptions = [3, 5, 7];

export function createPlaceholderCards(count) {
  return Array.from({ length: count }).map((_, index) => ({
    id: `placeholder-${index}`
  }));
}

export function formatCategoryLabel(category) {
  return category.trim() || 'Creator intelligence';
}
