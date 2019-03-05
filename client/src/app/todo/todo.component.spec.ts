import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
        {
          _id: 'chris_id',
          owner: 'Chris',
          status: true,
          category: 'homework',
          body: 'bleh bleh bleh'
        },
        {
          _id: 'pat_id',
          owner: 'Pat',
          status: false,
          category: 'video games',
          body: 'blah blah blah'
        },
        {
          _id: 'jamie_id',
          owner: 'Jamie',
          status: true,
          category: 'homework',
          body: 'bluh bluh bluh'
        }
      ].find(todo => todo._id === todoId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve Pat by ID', () => {
    todoComponent.setId('pat_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.owner).toBe('Pat');
    expect(todoComponent.todo.body).toBe('blah blah blah');
  });

  it('returns undefined for Santa', () => {
    todoComponent.setId('Santa');
    expect(todoComponent.todo).not.toBeDefined();
  });

});
