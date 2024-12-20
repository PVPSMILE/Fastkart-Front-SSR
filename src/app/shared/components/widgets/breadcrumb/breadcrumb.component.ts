import { Component, Input } from '@angular/core';
import { Breadcrumb } from '../../../interface/breadcrumb';
import { TitleCasePipe } from '../../../pipe/title-case.pipe';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: true,
    imports: [RouterLink, TitleCasePipe]
    
})
export class BreadcrumbComponent{
  

  @Input() breadcrumb: Breadcrumb | null;
  
  constructor(private router: Router) {}
  
  redirect(url: string | undefined) {
    // /collections?category=podorozhi-ta-vidpochynok&parentCategory=pet-shop
    // category=podorozhi-ta-vidpochynok&parentCategory=pet-shop
    // /collections?category=rodent-cages-accessories
    if (url?.includes('/collections')) {
      
      if ((url?.includes('/collections?category=')) && url?.includes('&parentCategory=')) {
        let urlArray = url ? url.split('?')[1]?.split('&') : [];
        let category = urlArray[0].split('=')[1];
        let parentCategory =  urlArray[1].split('=')[1];
  
        this.router.navigate(['/collections'], {
          queryParams: { category: category,
          parentCategory: parentCategory || null 
        }  
        });
        console.log('redirect to collections', category, parentCategory);
      }
      else if ((url?.includes('/collections?category=')) && !url?.includes('&parentCategory=')){
        let urlArray = url ? url.split('=')[1] : '';
        this.router.navigate(['/collections'], {
          queryParams: { category: urlArray,
        }  
        });

      }
      else this.router.navigate(['/collections']);
    }
    
  }
}
