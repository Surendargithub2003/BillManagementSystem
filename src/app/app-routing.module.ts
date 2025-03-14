import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { GeneratebillComponent } from './generatebill/generatebill.component';
import { BillListComponent } from './billlist/billlist.component';
const routes: Routes = [
  { path: 'home', component: BillingComponent },
  { path: 'billgen', component: GeneratebillComponent },
  { path: 'billlist', component: BillListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
