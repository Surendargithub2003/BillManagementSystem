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

interface Bill {
  _id: string;
  items: BillItem[];
  date: Date;
}

@Component({
  selector: 'app-bill-list',
  templateUrl: './billlist.component.html',
  styleUrls: ['./billlist.component.css'],
  standalone : false
})
export class BillListComponent implements OnInit {
  
  bills: Bill[] = [];
  newbills: Bill[] = [];
  searchQuery: string = '';
  selectedMonth: string = '';
  total_stock = 0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBills();
    
  }

  fetchBills() {
    this.http.get<{ message: string; bill: Bill[] }>('http://localhost:3000/api/bills')
      .subscribe(response => {
        this.bills = response.bill;
        this.newbills = [...this.bills];
        this.calculateTotalStock();
      });
      
      return this.bills;
  }

  onDelete(billId: string) {
    this.http.delete(`http://localhost:3000/api/bills/${billId}`)
      .subscribe(() => {
        this.fetchBills();
      });
  }

  calculateTotalStock(){
    this.total_stock = this.newbills.reduce((total, bill) => {
      return total + bill.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  }
  calculateBillTotal(bill: Bill): number {
    return bill.items.reduce((sum, item) => sum + item.total, 0);
    
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.fetchBills(); 
      return;
    }
  
    this.http.get<{ message: string; bill: any[] }>('http://localhost:3000/api/bills')
        .subscribe(response => {
          this.bills = response.bill.filter(bill =>
            bill._id.includes(this.searchQuery)
          );
        });
  }

  filterByMonth() {
    
    if (!this.selectedMonth) {
      this.fetchBills();
      return;
    }
    this.http.get<{ message: string; bill: Bill[] }>('http://localhost:3000/api/bills')
      .subscribe(response => {
        this.bills = response.bill.filter(bill => {
          const billDate = new Date(bill.date);
          return billDate.getMonth() + 1 === parseInt(this.selectedMonth);
        });
      });
  }
}

