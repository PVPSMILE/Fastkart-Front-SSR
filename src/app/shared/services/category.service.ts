// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
// import { environment } from "../../../../public/environments/environment";
// import { Params } from "../interface/core.interface";
// import { CategoryModel } from "../interface/category.interface";

// @Injectable({
//   providedIn: "root",
// })
// export class CategoryService {

//   constructor(private http: HttpClient) {}

//   getCategories(payload?: Params): Observable<CategoryModel> {
//     return this.http.get<CategoryModel>(`${environment.URL}/categories.json`, { params: payload });
//   }
// }

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { environment } from "../../../../public/environments/environment";
import { Params } from "../interface/core.interface";
import { CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getCategories(payload?: Params): Observable<CategoryModel> {
    return this.http
      .get<CategoryModel>('http://localhost:3000/all-categories', { params: payload })
      .pipe(
        catchError(err => {
          console.error('Error occurred:', err); // Логирование ошибок
          throw err; // Повторный выброс ошибки
        })
      );
  }
}
