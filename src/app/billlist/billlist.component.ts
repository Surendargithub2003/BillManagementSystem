
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBills();
  }

  fetchBills() {
    this.http.get<{ message: string; bill: Bill[] }>('http://localhost:3000/api/bills')
      .subscribe(response => {
        this.bills = response.bill;
      });
  }

  onDelete(billId: string) {
    this.http.delete(`http://localhost:3000/api/bills/${billId}`)
      .subscribe(() => {
        this.fetchBills();
      });

    
  }

  calculateBillTotal(bill: Bill): number {
    return bill.items.reduce((sum, item) => sum + item.total, 0);
  }
}