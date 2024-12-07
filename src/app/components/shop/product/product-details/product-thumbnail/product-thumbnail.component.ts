import { Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import * as data from  '../../../../../shared/data/owl-carousel';
import { TranslateModule } from '@ngx-translate/core';
import { ProductSidebarComponent } from '../sidebar/sidebar.component';
import { ProductDetailsTabsComponent } from '../widgets/product-details-tabs/product-details-tabs.component';
import { ProductBundleComponent } from '../widgets/product-bundle/product-bundle.component';
import { ProductSocialShareComponent } from '../widgets/product-social-share/product-social-share.component';
import { PaymentOptionComponent } from '../widgets/payment-option/payment-option.component';
import { ProductDeliveryInformationComponent } from '../widgets/product-delivery-information/product-delivery-information.component';
import { ProductInformationComponent } from '../widgets/product-information/product-information.component';
import { ProductActionComponent } from '../widgets/product-action/product-action.component';
import { ProductContainComponent } from '../widgets/product-contain/product-contain.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CarouselModule } from 'ngx-owl-carousel-o';


@Component({
    selector: 'app-product-thumbnail',
    templateUrl: './product-thumbnail.component.html',
    styleUrls: ['./product-thumbnail.component.scss'],
    standalone: true,
    imports: [CarouselModule, NgxImageZoomModule, ProductContainComponent, ProductActionComponent, ProductInformationComponent, ProductDeliveryInformationComponent, PaymentOptionComponent, ProductSocialShareComponent, ProductBundleComponent, ProductDetailsTabsComponent, ProductSidebarComponent, TranslateModule]
})
export class ProductThumbnailComponent {

  @Input() product: Product;
  @Input() option: Option | null;

  public activeSlide: string = '0';

  public productMainThumbSlider = data.productMainThumbSlider;
  public productThumbSlider = data.productThumbSlider;

}