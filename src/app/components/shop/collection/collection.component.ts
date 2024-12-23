import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Params } from '../../../shared/interface/core.interface';
import { Breadcrumb } from '../../../shared/interface/breadcrumb';
import { ProductModel } from '../../../shared/interface/product.interface';
import { GetProducts } from '../../../shared/action/product.action';
import { ProductState } from '../../../shared/state/product.state';
import { ThemeOptionState } from '../../../shared/state/theme-option.state';
import { Option } from '../../../shared/interface/theme-option.interface';
import { CollectionNoSidebarComponent } from './collection-no-sidebar/collection-no-sidebar.component';
import { CollectionOffCanvasFilterComponent } from './collection-offcanvas-filter/collection-offcanvas-filter.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionRightSidebarComponent } from './collection-right-sidebar/collection-right-sidebar.component';
import { CollectionLeftSidebarComponent } from './collection-left-sidebar/collection-left-sidebar.component';
import { CollectionBannerComponent } from './collection-banner/collection-banner.component';
import { CollectionCategorySidebarComponent } from './collection-category-sidebar/collection-category-sidebar.component';
import { CollectionCategorySliderComponent } from './collection-category-slider/collection-category-slider.component';

import { BreadcrumbComponent } from '../../../shared/components/widgets/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    standalone: true,
    imports: [BreadcrumbComponent, CollectionCategorySliderComponent, 
      CollectionCategorySidebarComponent, CollectionBannerComponent, 
      CollectionLeftSidebarComponent, CollectionRightSidebarComponent, 
      CollectionListComponent, CollectionOffCanvasFilterComponent, 
      CollectionNoSidebarComponent]
})
export class CollectionComponent {

  @Select(ProductState.product) product$: Observable<ProductModel>;
  @Select(ThemeOptionState.themeOptions) themeOptions$: Observable<Option>;

  public breadcrumb: Breadcrumb = {
    title: "Collections",
    items: [{ label: 'Categories', active: true }]
  };
  public layout: string = 'collection_category_slider';
  public skeleton: boolean = true;

  public filter: Params = {
    'page': 1, // Current page number
    'paginate': 200, // Display per page, // Note we are using json thats why its it static
    'status': 1,
    'field': '',
    'price': '',
    'category': '',
    'tag': '',
    'sort': '', // ASC, DSC
    'sortBy': '',
    'rating': '',
    'attribute': ''
  };

  public totalItems: number = 0;

  constructor(private route: ActivatedRoute,
    private store: Store) {

    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.filter = {
        'page': params['page'] ? params['page'] : 1,
        'paginate': 200, // Note we are using json thats why its it static
        'status': 1,
        'field': params['field'] ? params['field'] : this.filter['field'],
        'price': params['price'] ? params['price'] : '',
        'category': params['category'] ? params['category'] : '',
        'tag': params['tag'] ? params['tag'] : '',
        'sort': params['sort'] ? params['sort'] : '',
        'sortBy': params['sortBy'] ? params['sortBy'] : this.filter['sortBy'],
        'rating': params['rating'] ? params['rating'] : '',
        'attribute': params['attribute'] ? params['attribute'] : '',
      }

      this.updateBreadcrumb(params['category'], params['parentCategory']);
      this.store.dispatch(new GetProducts(this.filter));

      // Params For Demo Purpose only
      if(params['layout']) {
        this.layout = params['layout'];
      } else {
        // Get Collection Layout
        this.themeOptions$.subscribe(option => {
          this.layout = option?.collection && option?.collection?.collection_layout
            ? option?.collection?.collection_layout : 'collection_category_slider';
        });
      }

      this.filter['layout'] = this.layout;
    });

    this.product$.subscribe(product => this.totalItems = product?.total);
  }

  private updateBreadcrumb(category: string, parentCategory: string): void {

    if (!category) {
        this.breadcrumb.items = [{ label: 'Collections', active: true }];
        return; // Выход из метода, если категория не задана
    }
    if (parentCategory) {
        // Разделяем parentCategory по запятым и убираем лишние пробелы
        const parentCategoriesArray = parentCategory.split(',').map(item => item.trim());
        // Формируем хлебные крошки
        if (parentCategoriesArray.length > 1) {
          this.breadcrumb.items = [  
              { label: 'Categories', url: '/collections', active: false },
              { label: parentCategoriesArray[0], url: `/collections?category=${parentCategoriesArray[0]}`, active: false },
              { label: parentCategoriesArray[1], url: `/collections?category=${parentCategoriesArray[1]}&parentCategory=${parentCategoriesArray[0]}`, active: true }
          ];
        }
        else {
          this.breadcrumb.items = [
              { label: 'Categories', url: '/collections', active: false },
              { label: parentCategoriesArray[0], url: `/collections?category=${parentCategoriesArray[0]}`, active: false },
              
          ];
        }
        this.breadcrumb.items.push(
          { 
            label: category,  
            url: `/collections?category=${category}&parentCategory=${parentCategoriesArray.join(',')}`, 
            active: true 
        }
        )
        this.breadcrumb.title = category.charAt(0).toUpperCase() + category.slice(1);
        return;
    }

    // Если parentCategory отсутствует
    this.breadcrumb.items = [
        { label: 'Categories', url: '/collections', active: false },
        { label: category, url: `/collections?category=${category}`, active: true }
    ];
    this.breadcrumb.title = category.charAt(0).toUpperCase() + category.slice(1);
  }
  


}
