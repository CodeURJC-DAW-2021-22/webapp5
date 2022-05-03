enum ProductSize {"XS", "S", "M", "L", "XL"}

export interface Product{
  id? : number;
  name: string;
  description: string;
  price: number;
  stock: number;
  size: ProductSize;
  images: string[];
}
