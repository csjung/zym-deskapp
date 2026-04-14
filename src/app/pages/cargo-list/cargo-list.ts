import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CargoService } from '../../services/cargo-service';
import { CargoInfo } from './cargo-info';
import { Common } from '../../services/common';
import { CompanyPipe } from '../../common/company-pipe';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MyFilter } from '../my-filter/my-filter';

@Component({
  selector: 'app-cargo-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    CompanyPipe,
    MatBottomSheetModule,
  ],
  templateUrl: './cargo-list.html',
  styleUrl: './cargo-list.scss',
})
export class CargoList {

  private _bottomSheet = inject(MatBottomSheet);  
  cargoService: CargoService = inject(CargoService);
  filteredCargoList: CargoInfo[] = [];

  constructor(
    private common: Common,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    
  }

  get loading() {
    return this.cargoService.loading;
  }

  get inDate() {
    return this.cargoService.inDate;
  }

  get searchWord() {
    return this.cargoService.searchWord;
  }

  get searchLine() {
    return this.cargoService.searchLine;
  }

  get cargoList() {
    return this.cargoService.cargoData();
  }

  move(delta :any) {
    let d = new Date(Number(this.inDate()?.substring(0,4)), Number(this.inDate()?.substring(5,7)) -1, Number(this.inDate()?.substring(8,10)));
    this.inDate.set(this.datePipe.transform(d.setDate(d.getDate() + delta), 'yyyy-MM-dd'));
  }

  filter() {
    this._bottomSheet.open(MyFilter);
  }
  
}
