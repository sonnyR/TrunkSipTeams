import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private storageKey = 'activeTabIndex';
  private tabIndex: number = 0;

  constructor() {
    // Retrieve the active tab index from localStorage on service initialization
    const storedTabIndex = localStorage.getItem(this.storageKey); 
    this.tabIndex = storedTabIndex ? parseInt(storedTabIndex, 10) : 0; 
  }

  getTabIndex(): number {
    return this.tabIndex;
  }

  setTabIndex(index: number): void {
    this.tabIndex = index;
    // Save the active tab index to localStorage
    localStorage.setItem(this.storageKey, index.toString());
  }

}
