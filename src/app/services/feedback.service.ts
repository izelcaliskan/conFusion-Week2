import { Injectable, Inject, OnInit, Component } from "@angular/core";
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Feedback } from "../shared/feedback";
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(
        private http: HttpClient,
        private processHTTPMsgService: ProcessHTTPMsgService,
        @Inject('BaseURL') public baseURL: string
    ) { }

    submitFeedback(feedback: Feedback): Observable<Feedback> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
            .pipe(catchError(this.processHTTPMsgService.handleError));


    }
}



