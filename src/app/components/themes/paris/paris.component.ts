import { Component, Input, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { GetProducts } from '../../../shared/action/product.action';
import { GetBlogs } from '../../../shared/action/blog.action';
import { Paris } from '../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../shared/services/theme-option.service';
import * as data from  '../../../shared/data/owl-carousel';
import { NewsletterModalComponent } from '../../../shared/components/widgets/modal/newsletter-modal/newsletter-modal.component';
import { ExitModalComponent } from '../../../shared/components/widgets/modal/exit-modal/exit-modal.component';
import { NewsletterComponent } from '../widgets/newsletter/newsletter.component';
import { ImageLinkComponent } from '../../../shared/components/widgets/image-link/image-link.component';
import { TitleComponent } from '../../../shared/components/widgets/title/title.component';
import { ProductComponent } from '../widgets/product/product.component';
import { CategoriesComponent } from '../widgets/categories/categories.component';
import { BannerComponent } from '../widgets/banner/banner.component';
import { HomeBannerComponent } from '../widgets/home-banner/home-banner.component';

@Component({
    selector: 'app-paris',
    templateUrl: './paris.component.html',
    styleUrls: ['./paris.component.scss'],
    standalone: true,
    imports: [HomeBannerComponent, BannerComponent, CategoriesComponent, 
      ProductComponent, TitleComponent, ImageLinkComponent, NewsletterComponent]
})
export class ParisComponent {

  @Input() data?: Paris;
  @Input() slug?: string;

  @ViewChild("newsletterModal") NewsletterModal: NewsletterModalComponent;
  @ViewChild("exitModal") ExitModal: ExitModalComponent;

  public categorySlider = data.categorySlider;
  public isBrowser: boolean;

  constructor(private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeOptionService: ThemeOptionService) {
      this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) { // For SSR 
      if(this.data?.slug == this.slug) {
        // Get Products
        const getProducts$ = this.store.dispatch(new GetProducts({
          status: 1,
          ids: this.data?.content?.products_ids?.join(',')
        }));

        // Get Blogs
        const getBlogs$ = this.store.dispatch(new GetBlogs({
          status: 1,
          ids: this.data?.content.main_content?.section9_featured_blogs?.blog_ids.join(',')
        }));

        // Skeleton Loader
        document.body.classList.add('skeleton-body');

        forkJoin([getProducts$, getBlogs$]).subscribe({
          complete: () => {
            document.body.classList.remove('skeleton-body');
            this.themeOptionService.preloader = false;
          }
        });
      }

      // Change color for this layout
      document.documentElement.style.setProperty('--theme-color','#0da450');
      this.themeOptionService.theme_color = '#0da450';
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) { // For SSR 
      // Remove Color
      document.documentElement.style.removeProperty('--theme-color');
    }
  }
}
