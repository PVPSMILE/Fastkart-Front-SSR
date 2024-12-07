import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CompareState } from '../../../../state/compare.state';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header-compare',
    templateUrl: './compare.component.html',
    styleUrls: ['./compare.component.scss'],
    standalone: true,
    imports: [RouterLink, AsyncPipe]
})
export class CompareComponent {

  @Select(CompareState.compareTotal) compareTotal$: Observable<number>;
  
}
