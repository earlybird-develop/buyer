import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceFilter',
  pure: false
})
export class InvoiceFilter implements PipeTransform {
  transform(items: any[], fieldDate: any[], fieldAmount: any[]): any[] {
    var returnValue = [];
    var startDate = new Date();
    var endDate = new Date();
    if (fieldDate.length > 0) {
      fieldDate = fieldDate.sort();
      for (var j = 0; j < fieldDate.length; j++) {
        switch (fieldDate[j]) {
          case 1:
            endDate = this.addDays(15);
            returnValue = returnValue.concat(items.filter(function (i) {
              var originalPaydateTimeStamp = new Date(i['originalPaydate']);
              return originalPaydateTimeStamp <= endDate;
            }))
            break;
          case 2:
            startDate = this.addDays(15)
            endDate = this.addDays(30);
            returnValue = returnValue.concat(items.filter(function (i) {
              var originalPaydateTimeStamp = new Date(i['originalPaydate']);
              return originalPaydateTimeStamp <= endDate && originalPaydateTimeStamp > startDate;
            }))
            break;
          case 3:
            startDate = this.addDays(30)
            endDate = this.addDays(45);
            returnValue = returnValue.concat(items.filter(function (i) {
              var originalPaydateTimeStamp = new Date(i['originalPaydate']);
              return originalPaydateTimeStamp <= endDate && originalPaydateTimeStamp > startDate;
            }))
            break;
          case 4:
            startDate = this.addDays(45)
            returnValue = returnValue.concat(items.filter(function (i) {
              var originalPaydateTimeStamp = new Date(i['originalPaydate']);
              return originalPaydateTimeStamp > startDate;
            }))
            break;
        }

      }
    }
    else {
      returnValue = items;
    }

    if (fieldAmount.length > 0) {
      fieldAmount = fieldAmount.sort();
      var temReturnValue = [];
      for (var n = 0; n < fieldAmount.length; n++) {
        switch (fieldAmount[n]) {
          case 1:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return Number(e['invoiceAmount']) <= 25000;
            }));
            break;
          case 2:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return Number(e['invoiceAmount']) <= 50000 && Number(e['invoiceAmount']) > 25000;
            }));
            break;
          case 3:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return Number(e['invoiceAmount']) <= 75000 && Number(e['invoiceAmount']) > 50000;
            }));
            break;
          case 4:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return Number(e['invoiceAmount']) > 75000;
            }));
            break;
        }
      }
      returnValue = temReturnValue;
    }

    return returnValue;
  }
  addDays(numDays: number) {
    var today = Date.now();
    var returnDate: Date;
    returnDate = new Date(today + numDays * 24 * 60 * 60 * 1000);
    return returnDate;
  }
}
