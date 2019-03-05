import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
        {
          _id: 'chris_id',
          onwer: 'Chris',
          status: 'complete',
          category: 'homework',
          body: 'bleh bleh bleh'
        },
        {
          _id: 'pat_id',
          onwer: 'Pat',
          status: 'incomplete',
          category: 'video games',
          body: 'blah blah blah'
        },
        {
          _id: 'jamie_id',
          onwer: 'Jamie',
          status: 'complete',
          category: 'homework',
          body: 'bluh bluh bluh'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      // providers:    [ TodoListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.todo.length).toBe(3);
  });

  it('contains a owner named \'Chris\'', () => {
    expect(todoList.todo.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('contain a owner named \'Jamie\'', () => {
    expect(todoList.todo.some((todo: Todo) => todo.owner === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a owner named \'Santa\'', () => {
    expect(todoList.todo.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });

  it('has two owners with todo category homework', () => {
    expect(todoList.todo.filter((todo: Todo) => todo.category === 'homework').length).toBe(2);
  });

  it('todo list filters by owner', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoOwner = 'a';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });

  it('todo list filters by category', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = 'homework';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });

  it('todo list filters by name and age', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = 'homework';
    todoList.todoOwner = 'e';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
  });

});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.todo).toBeUndefined();
  });
});

/*
describe('Adding a user', () => {
  let userList: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  const newUser: User = {
    _id: '',
    name: 'Sam',
    age: 67,
    company: 'Things and stuff',
    email: 'sam@this.and.that'
  };
  const newId = 'sam_id';

  let calledUser: User;

  let userListServiceStub: {
    getUsers: () => Observable<User[]>,
    addNewUser: (newUser: User) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddUserComponent, any) => {
      afterClosed: () => Observable<User>
    };
  };


  beforeEach(() => {
    calledUser = null;
    // stub UserService for test purposes
    userListServiceStub = {
      getUsers: () => Observable.of([]),
      addNewUser: (newUser: User) => {
        calledUser = newUser;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newUser);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [UserListComponent],
      providers: [
        {provide: UserListService, useValue: userListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(UserListComponent);
      userList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls UserListService.addUser', () => {
    expect(calledUser).toBeNull();
    userList.openDialog();
    expect(calledUser).toEqual(newUser);
  });
});
*/
