import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InteractivePoint } from '../../shared/models/interactive-point.model';
import { InteractionService } from '../../core/interaction.service';
import { PortfolioDataService } from '../../core/portfolio-data.service';

@Component({
  selector: 'app-info-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnInit, OnDestroy {
  selectedPoint: InteractivePoint | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private interactionService: InteractionService,
    private portfolioDataService: PortfolioDataService
  ) {}

  ngOnInit(): void {
    this.interactionService.pick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pickInfo) => {
        this.portfolioDataService.getPointById(pickInfo.pointId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((point) => {
            this.selectedPoint = point || null;
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closePanel(): void {
    this.selectedPoint = null;
  }
}
