import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbSubject = new BehaviorSubject<{ items: { label: string, url: string }[], bgColor: string }>({ items: [], bgColor: '' });
    breadcrumb$ = this.breadcrumbSubject.asObservable();

  
    setBreadcrumb(breadcrumb: { items: { label: string, url: string }[], bgColor: string }) { 
      this.breadcrumbSubject.next(breadcrumb);
    }
  }