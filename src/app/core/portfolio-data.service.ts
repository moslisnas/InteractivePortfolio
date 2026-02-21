import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { InteractivePoint } from '../shared/models/interactive-point.model';
import { DecorationElement } from '../shared/models/decoration-element.model';
import { PORTFOLIO_DATA_POINTS } from '../shared/data/portfolio.constant';
import { PORTFOLIO_DATA_DECORATIONS } from '../shared/data/portfolio.constant';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private portfolioDataPoints$ = new BehaviorSubject<InteractivePoint[]>(PORTFOLIO_DATA_POINTS);
  private portfolioDataDecorations$ = new BehaviorSubject<DecorationElement[]>(PORTFOLIO_DATA_DECORATIONS);

  loadDataPoints(): Observable<InteractivePoint[]> {
    return of(PORTFOLIO_DATA_POINTS);
  }

  loadDataDecorations(): Observable<DecorationElement[]> {
    return of(PORTFOLIO_DATA_DECORATIONS);
  }

  getPoints(): Observable<InteractivePoint[]> {
    return this.portfolioDataPoints$.asObservable();
  }
  getDecorations(): Observable<DecorationElement[]> {
    return this.portfolioDataDecorations$.asObservable();
  }

  getPointById(id: string): Observable<InteractivePoint | undefined> {
    return new Observable(observer => {
      observer.next(PORTFOLIO_DATA_POINTS.find(p => p.id === id));
      observer.complete();
    });
  }
}
