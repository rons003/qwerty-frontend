import { Pipe, PipeTransform } from '@angular/core';
/*
 * Excludes elements in excludeArray from array it is applied to.
 * Takes in 2 arrays.
 * Usage:
 *   value | excludeElements:elements
 * Example:
 *   {{ challenges |  excludeElements:selectedChallenges}}
 *   formats to: challenges without elements in selectedChallenges
*/
@Pipe({name: 'excludeElements'})
export class ExcludeElementsPipe implements PipeTransform {
  transform(values: any[], excludeElements: any[]): any[] {
    const patternCheck = JSON.stringify(excludeElements);
    return values.filter(function(element: any) {
      const elementToFind = JSON.stringify(element);
      return patternCheck.indexOf(elementToFind) < 0;
    });
  }
}
