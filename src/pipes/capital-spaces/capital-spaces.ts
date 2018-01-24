import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CapitalSpacesPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'capitalSpaces',
})
export class CapitalSpacesPipe implements PipeTransform {
  /**
   * Takes a string and puts spaces before capital letters
   */
  transform(noSpaceString: string) {
    return noSpaceString.replace(/([A-Z])/g, ' $1').trim();
  }
}
