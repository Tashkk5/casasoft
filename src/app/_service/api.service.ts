import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Headers  from './headers'

@Injectable({
    providedIn: 'root'
})

export class APIService{
    constructor(private http: HttpClient) { }    

    GetIngredientID(ingredient:string): Observable<any> {
        const apiEndPoint = `${environment.nutroapi}?query=${ingredient}&apiKey=${environment.nutroapikey}`;
        return this.http.get(apiEndPoint, Headers.setNutroHeaders());
    }

    GetIngrediantInfo(id:string): Observable<any> {
        const apiEndPoint = `${environment.nutroinfoapi}/${id}/information?amount=100&unit=grams&apiKey=${environment.nutroapikey}`;
        return this.http.get(apiEndPoint, Headers.setNutroHeaders());
    }
}