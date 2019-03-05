import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
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
  ];
  const mTodos: Todo[] = testTodos.filter(todo =>
    todo.category.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the todoListService to meaningfully test company filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let todoListService: TodoListService;
  let currentlyImpossibleToGenerateSearchTodoUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoListService.getTodos().subscribe(
      todo => expect(todo).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos(todoCompany) adds appropriate param string to called URL', () => {
    todoListService.getTodos('m').subscribe(
      todo => expect(todo).toEqual(mTodos)
    );

    const req = httpTestingController.expectOne(todoListService.baseUrl + '?company=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mTodos);
  });

  it('filterByCompany(todoCompany) deals appropriately with a URL that already had a company', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?company=f&something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCompany('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&company=m&');
  });

  it('filterByCompany(todoCompany) deals appropriately with a URL that already had some filtering, but no company', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCompany('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&company=m&');
  });

  it('filterByCompany(todoCompany) deals appropriately with a URL has the keyword company, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchTodoUrl = todoListService.baseUrl + '?company=&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateSearchTodoUrl;
    todoListService.filterByCompany('');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '');
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('adding a todo calls api/todos/new', () => {
    const jesse_id = 'jesse_id';
    const newTodo: Todo = {
      _id: '',
      name: 'Jesse',
      age: 72,
      company: 'Smithsonian',
      email: 'jesse@stuff.com'
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });
});
