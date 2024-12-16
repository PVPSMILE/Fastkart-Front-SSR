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
  private hideTimeout: any; // Таймер для скрытия подкатегорий

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
        // console.log('Обновленные категории:', this.categories);
      } else {
        console.log('Категории не найдены.');
      }
    });
  }

  // Показать подкатегории
  showSubcategories(subcategories: Category[] | undefined, event: MouseEvent, categorySlug: string): void {
    this.subcategoryPosition === null
    // console.log('Показать подкатегории:', subcategories);
    if (!subcategories || subcategories.length === 0) {
      this.activeSubcategories = null;
      this.toggleScroll(false); // Разрешаем скролл, если нет подкатегорий
      return;
    }
  
    clearTimeout(this.hideTimeout);
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

    if (this.subcategoryPosition === null) {
      this.subcategoryPosition = {
        top: rect.top,
        left: leftOffset,
      };
    }
      this.toggleScroll(true); // Запрещаем скролл при отображении подкатегорий
  }
  
  hideSubcategories(): void {
    document.body.style.overflow = '';// Возвращаем стандартное значение
    this.hideTimeout = setTimeout(() => {
      this.activeSubcategories = null;
      this.activeCategorySlug = null;
      this.subcategoryPosition = null
    }, 0); 
  }
  
  // Логика для перехода
  redirectToCollection(slug: string): void {
    console.log('Переход к коллекции с идентификатором:', slug);
  }
}
