import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  private onRegionChanged(): void {
    this.myForm
      .get('region')!
      .valueChanges.pipe(
        // El siguiente tap ayuda a restablecer el valor de Country a ""
        // al momento de cambiar de Region para así mostrarse el valor
        // "Seleccione un País" en el selector del HTML
        tap(() => this.myForm.get('country')!.setValue('')),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries;
      });
  }

  private onCountryChange(): void {
    this.myForm
      .get('country')!
      .valueChanges.pipe(
        // El siguiente tap ayuda a restablecer el valor de Country a ""
        // al momento de cambiar de Region para así mostrarse el valor
        // "Seleccione un País" en el selector del HTML
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => (this.borders = [])),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode) =>
          this.countriesService.getCountryByAlphaCode(alphaCode)
        ),
        switchMap((country) =>
          this.countriesService.getCountriesBordersNameByAlphaCode(
            country.borders
          )
        )
      )
      .subscribe((countries) => {
        this.borders = countries;
      });
  }
}
