import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Product, ProductModel } from '../../../../shared/interface/product.interface';
import { ProductState } from '../../../../shared/state/product.state';
import { RouterLink } from '@angular/router';
import { NgClass, NgStyle, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-image-link',
    templateUrl: './image-link.component.html',
    styleUrls: ['./image-link.component.scss'],
    standalone: true,
    imports: [NgClass, NgStyle, RouterLink, AsyncPipe]
})
export class ImageLinkComponent {

  @Select(ProductState.product) product$: Observable<ProductModel>;

  @Input() image: any;
  @Input() link: string;
  @Input() bgImage: boolean;
  @Input() class: string;

  constructor(){}

  getProductSlug(id: number, products: Product[]){
    let product = products.find(product => product.id === id);
    return product ? product.slug : null;
  }

}
