import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select  } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ThemeState } from '../../shared/state/theme.state';
import { GetHomePage } from '../../shared/action/theme.action';
import { ThemeOptionService } from '../../shared/services/theme-option.service';
import { ParisComponent } from './paris/paris.component';
import { AsyncPipe } from '@angular/common';
  
@Component({
    selector: 'app-themes',
    templateUrl: './themes.component.html',
    styleUrls: ['./themes.component.scss'],
    standalone: true,
    imports: [ParisComponent, AsyncPipe]
})
export class ThemesComponent {

  @Select(ThemeState.homePage) homePage$: Observable<any>;

  public slug: string;

  constructor(private store: Store,
    private route: ActivatedRoute,
    private themeOptionService: ThemeOptionService) {
    this.route.params.subscribe(params => {
      this.themeOptionService.preloader = true;
      this.slug = params['slug'] ? params['slug'] : 'paris';
      this.store.dispatch(new GetHomePage(params['slug'] ? params['slug'] : 'paris'));
    });
  }

}
