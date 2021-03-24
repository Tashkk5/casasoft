import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/_services/auth.guard';
import { ListingpageComponent } from './listingpage/listingpage.component';
export const routes: Routes = [
  {
    path: 'listingpage',
    component: ListingpageComponent
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: 'listingpage',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
