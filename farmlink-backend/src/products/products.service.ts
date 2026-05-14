import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {

  private products = [
    { id: 1, name: 'Fresh Green Beans', category: 'Vegetable', price: 4.5, image: '/images/beans.jpg' },
    { id: 2, name: 'Fresh Broccoli', category: 'Vegetable', price: 3.75, image: '/images/broccoli.jpg' },
    { id: 3, name: 'Fresh Bell Peppers', category: 'Vegetable', price: 2.1, image: '/images/pepper.jpg' },
    { id: 4, name: 'Fresh Cucumbers', category: 'Vegetable', price: 2.5, image: '/images/cucumber.jpg' },
    { id: 5, name: 'Fresh Grapes', category: 'Fruit', price: 5.5, image: '/images/grape.jpg' },
    { id: 6, name: 'Fresh Apples', category: 'Fruit', price: 3.99, image: '/images/apple.jpg' },
    { id: 7, name: 'Fresh Oranges', category: 'Fruit', price: 4.2, image: '/images/orange.jpg' },
    { id: 8, name: 'Fresh Bananas', category: 'Fruit', price: 2.8, image: '/images/bananas.jpg' },
    { id: 9, name: 'Organic Tomatoes', category: 'Organic', price: 5.2, image: '/images/tomatoes.jpg' },
    { id: 10, name: 'Organic Cabbage', category: 'Organic', price: 3.5, image: '/images/cabbage.jpg' },
    { id: 11, name: 'Organic Lettuce', category: 'Organic', price: 4.0, image: '/images/lettuce.jpg' },
    { id: 12, name: 'Heirloom Carrots', category: 'Organic', price: 4.95, image: '/images/carrot.jpg' },
  ];

  // GET ALL
  findAll(category?: string, maxPrice?: number) {
    let result = this.products;

    if (category) {
      const categories = category.split(',');
      result = result.filter(p => categories.includes(p.category));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= maxPrice);
    }

    return result;
  }

  // GET ONE
  findOne(id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // CREATE
  create(data: any) {
    const newProduct = {
      id: this.products.length + 1, // simple auto increment
      ...data,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // UPDATE
  update(id: number, data: any) {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    this.products[index] = {
      ...this.products[index],
      ...data,
    };

    return this.products[index];
  }

  // DELETE
  remove(id: number) {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    const deleted = this.products[index];
    this.products.splice(index, 1);

    return {
      message: 'Product deleted successfully',
      data: deleted,
    };
  }
}