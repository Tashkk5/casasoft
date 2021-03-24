import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Headers from '../../../_service/headers';
@Injectable({
    providedIn: 'root',
})

export class AWSHTTPService {
    constructor(private http: HttpClient) { }
  
    // public methods
    Getitems(): Observable<any> {
      return this.http.get<any>(`${environment.awsgetapi}`, Headers.setHeaders('GET'));
    }
  
    PutItem(item: any): Observable<any> {
      return this.http.put<any>(`${environment.awsputapi}`, item);
    }

    DeleteItem(item: any): Observable<any> {
        return this.http.post<any>(`${environment.awsdeleteapi}`, item);
    }
}  