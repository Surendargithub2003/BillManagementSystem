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
    let printWindow = window.open('', '_blank');
  
    if (printWindow) {
      let billContent = `
        <html>
        <head><title>Bill</title>
        <style>
          body { font-family: sans-serif; }
          pre { white-space: pre-wrap; word-break: break-word; }
        </style>
        </head>
        <body>
            <h2>Generated Bill</h2>
      `;
      this.billItems.forEach(item => {
        billContent += `<pre>${item.product.name} - ₹${item.product.price} x ${item.quantity} = ₹${item.total}</pre>`;
      });
      billContent += `<h3>Total: ₹${this.calculateTotal()}</h3>
        </body>
        </html>
      `;
      printWindow.document.write(billContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close(); 
      this.saveBillItems();
    } else {
      alert("Please allow popups for printing.");
    }
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
      product: item.product._id, // Send only the product _id
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

