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
  isEditing = false;
  filteredProducts: any[] = [];
  editingProductId: string | null = null;
  searchQuery: string = '';
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
      if (this.isEditing && this.editingProductId) {
        this.http.put(`http://localhost:3000/api/products/${this.editingProductId}`, this.newProduct)
          .subscribe(() => {
            this.fetchProducts();
            const index = this.products.findIndex(p => p._id === this.editingProductId);
            if (index !== -1) {
              this.products[index] = { ...this.newProduct, _id: this.editingProductId };
            }
            this.isEditing = false;
          this.editingProductId = null;
          this.newProduct = { name: '', price: 0, stock: 0 };
            form.resetForm();
          });
        }
        else{
          this.http.post<{ message: string; productId: string }>('http://localhost:3000/api/products', this.newProduct)
        .subscribe(response => {
          this.fetchProducts();
          this.products.push({ ...this.newProduct, _id: response.productId }); 
          this.newProduct = { name: '', price: 0, stock: 0 }; 
          form.resetForm();
        });
        }
      
    }
  }

  onEdit(product: any) {
    this.newProduct = { ...product };
    this.isEditing = true;
    this.editingProductId = product._id;
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this bill?')){
      this.http.delete(`http://localhost:3000/api/products/${id}`)
      .subscribe(() => {
        this.products = this.products.filter(p => p._id !== id);
        alert('Product deleted successfully!');
      });
    }
    
  }

  onCancelEdit() {
    this.isEditing = false;
    this.editingProductId = null;
    this.newProduct = { name: '', price: 0, stock: 0 };
  }
  filterProducts() {
    if (!this.searchQuery) {
      this.fetchProducts(); 
      return;
    }
  
    this.http.get<{ message: string; products: any[] }>('http://localhost:3000/api/products')
        .subscribe(response => {
          this.products = response.products.filter(product =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        });
}

}