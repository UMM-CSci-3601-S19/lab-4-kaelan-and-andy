import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Todo} from './todo';
import {environment} from '../../environments/environment';


@Injectable()
export class TodoListService {
  readonly baseUrl: string = environment.API_URL + 'todos';
  private todoUrl: string = this.baseUrl;
  private blancheUrl: string = this.todoUrl + '?owner=Blanche&status=true';

  constructor(private http: HttpClient) {
  }

  getTodos(todoOwner?: string, todoStatus?: string, todoBody?: string, todoCategory?: string): Observable<Todo[]> {
    this.filterByOwner(todoOwner);
    this.filterByStatus(todoStatus);
    this.filterByBody(todoBody);
    this.filterByCategory(todoCategory);
    return this.http.get<Todo[]>(this.todoUrl);
  }

  getBlanche(blancheCategory){
    this.filterByCategoryBlanche(blancheCategory);
    return this.http.get<Todo[]>(this.blancheUrl);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(this.todoUrl + '/' + id);
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getUsersByCompany(userCompany?: string): Observable<User> {
      this.userUrl = this.userUrl + (!(userCompany == null || userCompany == "") ? "?company=" + userCompany : "");
      console.log("The url is: " + this.userUrl);
      return this.http.request(this.userUrl).map(res => res.json());
  }
  */
  filterByCategoryBlanche(blancheCategory?: string): void {
    if (!(blancheCategory == null || blancheCategory === '')) {
      if (this.parameterPresent('category=')) {
        this.removeParameter('category=');
      }
      if (this.blancheUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.blancheUrl += 'category=' + blancheCategory + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.blancheUrl += '?category=' + blancheCategory + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('category=')) {
        let start = this.blancheUrl.indexOf('category=');
        const end = this.blancheUrl.indexOf('&', start);
        if (this.blancheUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.blancheUrl = this.blancheUrl.substring(0, start) + this.blancheUrl.substring(end + 1);
      }
    }
  }

  filterByCategory(todoCategory?: string): void {
    if (!(todoCategory == null || todoCategory === '')) {
      if (this.parameterPresent('category=')) {
        this.removeParameter('category=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += 'category=' + todoCategory + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?category=' + todoCategory + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('category=')) {
        let start = this.todoUrl.indexOf('category=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }

  filterByOwner(todoOwner?: string): void {
    if (!(todoOwner == null || todoOwner === '')) {
      if (this.parameterPresent('category=')) {
        this.removeParameter('category=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += 'owner=' + todoOwner + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?owner=' + todoOwner + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('owner=')) {
        let start = this.todoUrl.indexOf('owner=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }

  filterByBody(todoBody?: string): void {
    if (!(todoBody == null || todoBody === '')) {
      if (this.parameterPresent('body=')) {
        this.removeParameter('body=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += 'body=' + todoBody + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?body=' + todoBody + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('body=')) {
        let start = this.todoUrl.indexOf('body=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }


  filterByStatus(todoStatus?: string): void {
    if (!(todoStatus == null || todoStatus === '')) {
      if (this.parameterPresent('status=')) {
        this.removeParameter('status=');
      }
      if (this.todoUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.todoUrl += 'status=' + todoStatus + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.todoUrl += '?status=' + todoStatus + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('status=')) {
        let start = this.todoUrl.indexOf('status=');
        const end = this.todoUrl.indexOf('&', start);
        if (this.todoUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.todoUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.todoUrl.indexOf(searchParam);
    let end = 0;
    if (this.todoUrl.indexOf('&') !== -1) {
      end = this.todoUrl.indexOf('&', start) + 1;
    } else {
      end = this.todoUrl.indexOf('&', start);
    }
    this.todoUrl = this.todoUrl.substring(0, start) + this.todoUrl.substring(end);
  }

  addNewTodo(newTodo: Todo): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new user back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new user with the user data as the body with specified headers.
    return this.http.post<string>(this.todoUrl + '/new', newTodo, httpOptions);
  }
}
