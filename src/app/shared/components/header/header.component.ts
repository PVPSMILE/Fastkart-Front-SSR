import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Option } from '../../interface/theme-option.interface';
import { ThemeOptionState } from '../../state/theme-option.state';
import { BasicHeaderComponent } from './basic-header/basic-header.component';
import { ClassicHeaderComponent } from './classic-header/classic-header.component';
import { MinimalHeaderComponent } from './minimal-header/minimal-header.component';
import { StandardHeaderComponent } from './standard-header/standard-header.component';
import { MobileMenuComponent } from './widgets/mobile-menu/mobile-menu.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [BasicHeaderComponent, ClassicHeaderComponent, StandardHeaderComponent, MinimalHeaderComponent, MobileMenuComponent, AsyncPipe]
})
export class HeaderComponent {

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  
  @Input() logo?: string | undefined;

  public style: string = 'basic_header';
  public sticky: boolean = true;

  constructor(router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.setHeader();
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.setHeader();
      }
    });
  }

  setHeader() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      if(window.location.pathname.includes('/theme/rome')) {
        this.style = 'standard_header';
      } else if(window.location.pathname.includes('/theme/madrid')) {
        this.style = 'classic_header';
      } else if(window.location.pathname.includes('/theme/berlin') || window.location.pathname.includes('/theme/denver')) {
        this.style = 'minimal_header';
      } else {
        this.themeOption$.subscribe(theme => {
          this.style = theme?.header ? theme?.header?.header_options : 'basic_header';
          this.sticky = theme?.header && theme?.header?.sticky_header_enable ? true : this.sticky;
        });
      }
    }
  }

}
