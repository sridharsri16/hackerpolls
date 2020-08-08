import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidatecrudComponent } from './candidatecrud/candidatecrud.component';
import { HomelistComponent } from './homelist/homelist.component';

const routes: Routes = [
  {
    path: "candidatecrud", component: CandidatecrudComponent,
  },
  {
    path: "homelist", component: HomelistComponent,
  },
  { path: "", component: HomelistComponent, },
  { path: '**', component: HomelistComponent, }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
