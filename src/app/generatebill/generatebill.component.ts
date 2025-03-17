import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface Product {
  _id: string; 
  name: string;
  price: number;
}

interface BillItem {
  product: Product;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-generatebill',
  standalone: false,
  templateUrl: './generatebill.component.html',
  styleUrl: './generatebill.component.css'
})
export class GeneratebillComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  quantity: number = 1;
  billItems: BillItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<{ message: string; products: Product[] }>('http://localhost:3000/api/products')
      .subscribe(response => {
        this.products = response.products;
      });
  }

  addProductToBill() {
    if (this.selectedProduct && this.quantity > 0) {
      const total = this.selectedProduct.price * this.quantity;
      this.billItems.push({
        product: this.selectedProduct,
        quantity: this.quantity,
        total: total,
      });
      this.selectedProduct = null;
      this.quantity = 1; 
    }
  }

  calculateTotal(): number {
    return this.billItems.reduce((sum, item) => sum + item.total, 0);
  }

  removeItem(index: number) {
    this.billItems.splice(index, 1);
  }
  

  generateBill() {
    this.http.get('bill-template.html', { responseType: 'text' }).subscribe(template => {
      let printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(template);
        printWindow.document.close();
        printWindow.focus();
  
        setTimeout(() => {
          let billBody = printWindow.document.getElementById("bill-body");
          let billTotal = printWindow.document.getElementById("bill-total");
  
          if (billBody && billTotal) {
            this.billItems.forEach(item => {
              let row = printWindow.document.createElement("tr");
              row.innerHTML = `
                <td>${item.product.name}</td>
                <td>₹${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>₹${item.total}</td>
              `;
              billBody.appendChild(row);
            });
  
            billTotal.innerText = `Total: ₹${this.calculateTotal()}`;
          }
  
          printWindow.print();
          printWindow.close();
        }, 500);
        
        this.saveBillItems();
      } else {
        alert("Please allow popups for printing.");
      }
    });
  }
  

 
  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
 
  saveBillItems() {
    const billItemsToSave = this.billItems.map(item => ({
      product: item.product._id, 
      quantity: item.quantity,
      total: item.total
    }));

    this.http.post<{ message: string; billId: string }>('http://localhost:3000/api/bills', { items: billItemsToSave })
      .subscribe(response => {
        console.log('Bill items saved successfully:', response);
      }, error => {
        console.error('Error saving bill items:', error);
      });
  }
  
}

