import { Component, Input, OnInit } from '@angular/core';
import { Option } from '../../../../interface/theme-option.interface';
import { Category, CategoryModel } from 'src/app/shared/interface/category.interface';
import { Select } from '@ngxs/store';
import { CategoryState } from 'src/app/shared/state/category.state';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../../../widgets/button/button.component';
import { CategoriesComponent } from '../../../widgets/categories/categories.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [ButtonComponent, CategoriesComponent, TranslateModule, NgIf, NgFor, NgStyle]
})
export class CategoriesBlockComponent implements OnInit {
  @Input() data: any | null;

  @Select(CategoryState.category) category$: Observable<CategoryModel>;

  public categories: Category[] = []; // Инициализация пустым массивом
  public activeCategorySlug: string | null = null; // Сохраняем slug активной категории
  public activeSubcategories: any[] | null = null; // Подкатегории текущей категории
  public subcategoryPosition: { top: number; left: number } | null = null; // Координаты подкатегорий
  public selectedCategorySlug: string[] = [];

  private toggleScroll(disable: boolean): void {
    if (disable) {
      document.body.style.overflow = 'hidden'; // Запрещаем прокрутку
    } else {
      document.body.style.overflow = '';
    }
  }
  ngOnInit(): void {
    // Подписка на изменения в категориях
    this.category$.subscribe((categoriesModel: CategoryModel) => {
      if (Array.isArray(categoriesModel?.data)) {
        this.categories = categoriesModel.data; // Обновляем список категорий
      } else {
        console.log('Категории не найдены.');
      }
    });
  }

  constructor(private route: ActivatedRoute,
      private router: Router) {
      this.category$.subscribe(res => this.categories = res?.data?.filter(category => category.type == 'product'));
      this.route.queryParams.subscribe(params => {
        this.selectedCategorySlug = params['category'] ? params['category'].split(',') : [];
      });
    }
  // Показать подкатегории
  showSubcategories(subcategories: Category[] | undefined, event: MouseEvent, categorySlug: string): void {
    if (!subcategories || subcategories.length === 0) {
      this.activeSubcategories = null;
      this.toggleScroll(false); // Разрешаем скролл, если нет подкатегорий
      return;
    }
  
    this.activeSubcategories = subcategories;
    this.activeCategorySlug = categorySlug;
  
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    let leftOffset = rect.right - 5; // Стандартное значение

    // Если ширина экрана меньше 1200px, увеличиваем смещение влево
    if (screenWidth < 1200) {
      leftOffset -= 60; // Увеличиваем сдвиг влево на 50 пикселей (можете изменить это значение)
    }
    else if (screenWidth < 1100) {
      leftOffset -= 100;
    }

    // if (this.subcategoryPosition === null) {
      this.subcategoryPosition = {
        top: rect.top,
        left: leftOffset,
      };
    // }
      this.toggleScroll(true); // Запрещаем скролл при отображении подкатегорий
  }
  
  hideSubcategories(): void {
    document.body.style.overflow = '';// Возвращаем стандартное значение
    this.activeSubcategories = null;
    this.activeCategorySlug = null;
      // this.subcategoryPosition = null
  }
  hideCategories(): void {
    this.activeCategorySlug = null;
  }
  
  handleCategoryClick(category: Category, type_category: string, subcategory_slug?: string): void {
     // Сохраняем slug выбранной категории
    if (type_category == 'category') {
      this.selectedCategorySlug = [category.slug];
    }
    else if (type_category == 'subcategory') {
      const parentSlug = this.activeCategorySlug || ''; // Сохраняем slug родительской категории
      this.selectedCategorySlug = [parentSlug, category.slug];
    }
    else if (type_category == 'subsubcategory') {
      const parentSlug = `${this.activeCategorySlug},${subcategory_slug!}`; // Сохраняем slug родительской категории
      this.selectedCategorySlug = [parentSlug, category.slug];
    }
    this.redirect(); // Выполняем редирект
  }

  // Редирект с обновлением параметров маршрута
  redirect(): void {
    const currentSlug = this.selectedCategorySlug[this.selectedCategorySlug.length - 1]; // Последний slug
    const parentSlugPath = this.selectedCategorySlug.slice(0, -1).join(','); // Родители

    console.log('Redirecting to /collections with:', {
      category: currentSlug,
      parentCategory: parentSlugPath || null
    });

    this.router.navigate(['/collections'], {
      queryParams: {
        category: currentSlug,
        parentCategory: parentSlugPath || null
      },
      queryParamsHandling: 'merge'
    });
  }
}
