import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  concat,
  delay,
  forkJoin,
  interval,
  map,
  merge,
  Observable,
  of,
  retry,
  share,
  shareReplay,
  throwError,
  timeout,
  zip,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiLocal = 'http://localhost:3000/users';
  private apiExterna = 'https://jsonplaceholder.typicode.com/todos/1';

  constructor(private http: HttpClient) {}

  getUsersForkJoin(): Observable<any> {
    return forkJoin({
      apiLocal: this.http.get<any>(this.apiLocal),
      apiexterna: this.http.get<any>(this.apiExterna).pipe(delay(3000)),
    });
  }

  getUsersZip(): Observable<any> {
    return zip(
      this.http.get<any>(this.apiLocal),
      this.http.get<any>(this.apiExterna).pipe(delay(3000))
    );
  }

  getUsersMerge(): Observable<any> {
    const myInterval$ = interval(1000);

    return merge(
      myInterval$,
      this.http.get<any>(this.apiLocal),
      this.http.get<any>(this.apiExterna).pipe(delay(3000))
    );
  }

  getUsersConcat(): Observable<any> {
    const myInterval$ = interval(1000);

    return concat(
      myInterval$,
      this.http.get<any>(this.apiLocal),
      this.http.get<any>(this.apiExterna).pipe(delay(3000))
    );
  }

  getUsersMap(): Observable<any> {
    return this.http
      .get<any>(this.apiExterna)
      .pipe(map((res: any) => res?.title));
  }

  getUserSwitchMap(): Observable<any> {
    const url = 'http://localhost:3000/user';

    return this.http.get<any>(url);
  }

  getUserByCpf(id: number): Observable<any> {
    const params = new HttpParams().set('id', id);

    return this.http.get<any>(this.apiLocal, { params });
  }

  getUserByNameDebounceTime(name: string): Observable<any> {
    const params = { name: name };

    return this.http.get<any>(this.apiLocal, { params });
  }

  getUsersShareReplay(): Observable<any> {
    return this.http.get<any>(this.apiLocal).pipe(shareReplay(1));
  }

  getUsersShare(): Observable<any> {
    return this.http.get<any>(this.apiLocal).pipe(share());
  }

  getUsersCatchError(): Observable<any> {
    const wrongUrl = `${this.apiLocal}/wrong`;

    return this.http.get<any>(wrongUrl).pipe(
      catchError((e) => {
        if (e.status === 400) {
          return of(
            'Ops! Não foi possível efetuar a requisição, contato o desenvolvedor'
          );
        }

        if (e.status === 401) {
          return of('Ops! Não autorizado');
        }

        if (e.status === 404) {
          return of('Ops! URL não encontrada');
        }

        if (e.status === 405) {
          return of('Ops! Método não permitido');
        }

        return throwError(() => e);
      }),
      retry(3)
    );
  }

  getUsersDelay(): Observable<any> {
    return this.http.get<any>(this.apiLocal).pipe(delay(2000));
  }

  getUsersTimeout(): Observable<any> {
    return this.http.get<any>(this.apiLocal).pipe(
      delay(5000),
      timeout(3000),
      catchError((e) => of('Ops! Aconteceu algo de errado', e))
    );
  }
}
