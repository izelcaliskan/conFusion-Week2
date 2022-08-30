import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AlperTestService {

    

    constructor(
        private http: HttpClient
    ) { }

    getData(): Observable<IBlogPost[]> {
        let url = "https://blog.repricerai.com/wp-json/wp/v2/posts?order=desc&per_page=3";
        return this.http.get<IBlogPost[]>(url);
    }

}

export interface IBlogPost {
    date: Date;
    link: string;
    title: IBlogPostTitle;
}

export interface IBlogPostTitle {
    rendered: string;
}

// 

