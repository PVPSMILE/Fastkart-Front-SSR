import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, CategoryModel } from '../../../interface/category.interface';
import { CategoryState } from '../../../state/category.state';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [ButtonComponent, CarouselModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent{

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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.category$.subscribe(res => {
      this.categories = res?.data?.filter(category => category.type === 'product') || [];
    });

    this.route.queryParams.subscribe(params => {
      this.selectedCategorySlug = params['category'] ? params['category'].split(',') : [];
    });
  }

  ngOnChanges(): void {
    if (this.categoryIds && this.categoryIds.length) {
      this.category$.subscribe(res => {
        this.categories = res.data.filter(category => this.categoryIds.includes(category.id));
      });
    }
  }

  selectCategory(id: number): void {
    this.selectedCategory.emit(id);
  }

  getSubcategories(): Category[] {
    const currentCategory = this.categories.find(category =>
      this.selectedCategorySlug.includes(category.slug)
    );
    return currentCategory?.subcategories || [];
  }

 
  redirectToSubCollection(slug: string): void {
    const parentSlug = this.selectedCategorySlug[0] || ''; // Родительская категория

    this.selectedCategorySlug = [slug];

    this.router.navigate(['/collections_2'], {
      relativeTo: this.route,
      queryParams: {
        category: slug,
        parentCategory: parentSlug // Передаём slug родительской категории
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }
}
