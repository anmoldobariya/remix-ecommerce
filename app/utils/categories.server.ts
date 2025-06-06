import { getDb } from './db.server';

export interface CategoryOption {
  value: string;
  label: string;
}

export async function getActiveCategories() {
  const db = await getDb();
  const categoriesCollection = db.collection('categories');

  const categories = await categoriesCollection
    .find({ isActive: true })
    .sort({ type: 1, name: 1 })
    .toArray();

  const genderCategories: CategoryOption[] = categories
    .filter((cat) => cat.type === 'gender')
    .map((cat) => ({
      value: cat.name,
      label: cat.displayName
    }));

  const productCategories: CategoryOption[] = categories
    .filter((cat) => cat.type === 'product')
    .map((cat) => ({
      value: cat.name,
      label: cat.displayName
    }));

  return {
    genderCategories,
    productCategories
  };
}

export async function getGenderCategories(): Promise<CategoryOption[]> {
  const db = await getDb();
  const categoriesCollection = db.collection('categories');

  const categories = await categoriesCollection
    .find({ type: 'gender', isActive: true })
    .sort({ name: 1 })
    .toArray();

  return categories.map((cat) => ({
    value: cat.name,
    label: cat.displayName
  }));
}

export async function getProductCategories(): Promise<CategoryOption[]> {
  const db = await getDb();
  const categoriesCollection = db.collection('categories');

  const categories = await categoriesCollection
    .find({ type: 'product', isActive: true })
    .sort({ name: 1 })
    .toArray();

  return categories.map((cat) => ({
    value: cat.name,
    label: cat.displayName
  }));
}
