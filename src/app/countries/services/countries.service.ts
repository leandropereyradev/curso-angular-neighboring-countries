import { Injectable } from '@angular/core';
import { Region } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _regions: Region[] = [
    Region.Afica,
    Region.Americas,
    Region.Asia,
    Region.Europa,
    Region.Oceania,
  ];

  constructor() {}

  get regions(): Region[] {
    return structuredClone(this._regions);
  }
}
