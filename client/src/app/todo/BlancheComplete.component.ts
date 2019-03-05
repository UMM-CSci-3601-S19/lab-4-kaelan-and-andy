import {Component, OnInit} from '@angular/core';
import {TodoListService} from './todo-list.service';
import {Todo} from './todo';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddTodoComponent} from './add-todo.component';

@Component({
  selector: 'BlancheComplete-component',
  templateUrl: 'BlancheComplete.component.html',
  styleUrls: ['./BlancheComplete.component.css'],
})
export class BlancheListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public blanche: Todo[];
  public filteredBlanche: Todo[];

  public blancheCategory: string;
  public blancheBody: string;

  constructor(public todoListService: TodoListService, public dialog: MatDialog) {

  }

  public filterBlanche(searchBody: string, searchCategory: string): Todo[] {

    this.filteredBlanche = this.blanche;

    // Filter by body
    if (searchBody != null) {
      searchBody = searchBody.toLocaleLowerCase();

      this.filteredBlanche = this.filteredBlanche.filter(todo => {
        return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
      });
    }

    // Filter by category
    if (searchCategory != null) {
      this.filteredBlanche = this.filteredBlanche.filter(todo => {
        return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
      });
    }

    return this.filteredBlanche;
  }

  refreshTodos(): Observable<Todo[]> {
    // Get Todos returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const blanche: Observable<Todo[]> = this.todoListService.getBlanche('');
    blanche.subscribe(
      blanche => {
        this.blanche = blanche;
        this.filterBlanche(this.blancheBody, this.blancheCategory);
      },
      err => {
        console.log(err);
      });
    return blanche;
  }

  loadService(): void {
    this.todoListService.getBlanche(this.blancheCategory).subscribe(
      blanche => {
        this.blanche = blanche;
        this.filteredBlanche = this.blanche;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshTodos();
    this.loadService();
  }

}
