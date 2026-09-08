//types 
export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  status: 'pending' | 'completed';
}