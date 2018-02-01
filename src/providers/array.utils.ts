import { Injectable } from '@angular/core';


/*
  Generated class for the ArrayUtils provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ArrayUtils {

  constructor() { }

  unique(array: any[]) {
    const a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j])
          a.splice(j--, 1);
      }
    }

    return a;
  }
} 
