import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { Select } from '@ngxs/store';
import { filter, map, Observable } from 'rxjs';
import { Category, CategoryModel } from '../../../interface/category.interface';
import { CategoryState } from '../../../state/category.state';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [ButtonComponent, CarouselModule, ReactiveFormsModule, TranslateModule]
})
export class CategoriesComponent implements OnChanges {
  @Select(CategoryState.category) category$: Observable<CategoryModel>;

  @Input() categoryIds: number[] = [];
  @Input() style: string = 'vertical';
  @Input() title?: string;
  @Input() image?: string;
  @Input() theme: string;
  @Input() sliderOption: OwlOptions;
  @Input() selectedCategoryId: number;
  @Input() bgImage: string;

  @Output() selectedCategory: EventEmitter<number> = new EventEmitter();

  public categories: Category[] = [];
  public selectedCategorySlug: string[] = [];
  private _subcategories: Category[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    // Подписка на состояние категорий
    this.category$
      .subscribe(res => {
        this.categories = res?.data?.filter(category => category.type === 'product') || [];;
        this.updateSubcategories(); // Пересчитать подкатегории при изменении данных
      });

    // Подписка на изменения параметров маршрута
    this.route.queryParams.subscribe(params => {
      const currentCategory = params['category'];
      const parentCategory = params['parentCategory'];

      this.selectedCategorySlug = parentCategory
        ? [parentCategory, currentCategory]
        : currentCategory
        ? [currentCategory]
        : [];

      this.updateSubcategories(); // Пересчитать подкатегории при изменении маршрута
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategorySlug'] || changes['categories']) {
      this.updateSubcategories(); // Обновить подкатегории, если изменились входные данные
    }
  }

  // Геттер для подкатегорий
  get subcategories(): Category[] {
    return this._subcategories;
  }

  // Обновление подкатегорий на основе выбранного пути
  updateSubcategories(): void {
    let currentCategories = this.categories;
    for (const slug of this.selectedCategorySlug) {
      const currentCategory = currentCategories.find(category => category.slug === slug);
      if (currentCategory) {
        if (currentCategory.subcategories?.length) {
          currentCategories = currentCategory.subcategories;
        } else {
          console.warn(`Category found, but no subcategories for slug: ${slug}`);
          this._subcategories = [];
          return;
        }
      } else {
        console.log(`Category not found for slug: ${slug}`);
        this._subcategories = [];
        return;
      }
    }
    this._subcategories = currentCategories;
  }

  // Обработка клика по категории
  handleCategoryClick(category: Category): void {
    // Если категория уже выбрана, удаляем ее из пути
    if (this.selectedCategorySlug.includes(category.slug)) {
      this.selectedCategorySlug = this.selectedCategorySlug.slice(
        0,
        this.selectedCategorySlug.indexOf(category.slug) + 1
      );
    } else {
      // Добавляем новую категорию в путь
      this.selectedCategorySlug = [...this.selectedCategorySlug, category.slug];
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

  // Эмит события выбора категории
  selectCategory(id: number): void {
    this.selectedCategory.emit(id);
  }
}