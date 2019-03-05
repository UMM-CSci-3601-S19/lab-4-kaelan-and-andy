// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {TodoListComponent} from "./todo/todo-list.component";
import {BlancheListComponent} from "./todo/BlancheComplete.component";

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'todos', component: TodoListComponent},
  {path: 'blanche', component: BlancheListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
