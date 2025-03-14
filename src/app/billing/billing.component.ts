import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  standalone: false
})
export class BillingComponent implements OnInit {
  newProduct = { name: '', price: 0, stock: 0 };
  products: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<{ message: string; products: any[] }>('http://localhost:3000/api/products')
      .subscribe(response => {
        this.products = response.products;
      });
  }

  onAddProduct(form: any) {
    if (form.valid) {
      this.http.post<{ message: string; productId: string }>('http://localhost:3000/api/products', this.newProduct)
        .subscribe(response => {
          this.products.push({ ...this.newProduct, _id: response.productId }); 
          this.newProduct = { name: '', price: 0, stock: 0 }; 
          form.resetForm();
        });
    }
  }

  onEdit(product: any) {
    this.newProduct = { ...product };
  }

  onDelete(id: string) {
    this.http.delete(`http://localhost:3000/api/products/${id}`)
      .subscribe(() => {
        this.products = this.products.filter(p => p._id !== id);
      });
  }
}
