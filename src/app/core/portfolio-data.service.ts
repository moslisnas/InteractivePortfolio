import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { InteractivePoint } from '../shared/models/interactive-point.model';
import { PORTFOLIO_DATA } from '../shared/data/portfolio.constant';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private portfolioData$ = new BehaviorSubject<InteractivePoint[]>(PORTFOLIO_DATA);

  loadData(): Observable<InteractivePoint[]> {
    return of(PORTFOLIO_DATA);
  }

  getPoints(): Observable<InteractivePoint[]> {
    return this.portfolioData$.asObservable();
  }

  getPointById(id: string): Observable<InteractivePoint | undefined> {
    return new Observable(observer => {
      observer.next(PORTFOLIO_DATA.find(p => p.id === id));
      observer.complete();
    });
  }
}
