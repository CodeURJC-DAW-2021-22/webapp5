import { Product } from './product.model';
import { User } from './user.model';

export interface Transaction{
  id?: number;
  type: string;
  user: User;
  date: string;
  totalPrice: number;
  products: Product[];
}
