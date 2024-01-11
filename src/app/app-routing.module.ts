import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BetBuilderComponent } from './bet-builder/bet-builder.component'; 
import { FirstpageComponent } from './firstpage/firstpage.component'; 


const routes: Routes = [
  { path: '', component: FirstpageComponent },
  { path: 'bet-builder/:source', component: BetBuilderComponent },
  { path: 'firstpage', component: FirstpageComponent },
  { path: '**', redirectTo: '' } // Redirect to the signup page if the URL doesn't match any route.
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
