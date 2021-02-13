import { Component } from '@angular/core';
import sampleData  from './transactions.json';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {TranslateService} from '@ngx-translate/core';
import $ from 'jquery';
import { SelectorMatcher } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  /*Translation Service*/
  langs: string[] = [];
    constructor(private translate: TranslateService) {
      /*Supported Languages*/
      this.translate.addLangs(['en','es']);


    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('es');
}

/*Change Language*/
changeLang(lang: string){
  this.translate.use(lang);
}

/*Show the preview of the transaction and disable the amount input field*/
  preview:boolean = false;
  disableInput:boolean= false;

/*Use imported JSON Data*/
  Datos: any = sampleData; 
 
  // Object {name:"Sammy",age:6,favoriteFood:"Tofu"}
/*TRANSFERENCE PROCESS*/

/*Shows preview of the transaction and checks that the balance is enough for the transference*/
submit(){  

/*Get the value of the input From account*/
var getBalance =  (<HTMLInputElement>document.getElementById('fromAccount')).value;
 console.log(getBalance);

/*Cut the string to obtain the numeric value of the balance*/
 var balance = getBalance.substring(getBalance.indexOf("$") + 1);
 console.log('current Balance ' + balance);

 /*Get the value of the Amount to transfer*/
 var getAmount = (<HTMLInputElement>document.getElementById('amount')).value;
 console.log(getAmount);

  /*Stop user to overdraw his balance*/
    if(Number(balance) < Number(getAmount)){
      Swal.fire(this.translate.instant('form.sweetWarning'),'', 'warning');
    } else {
      this.preview = !this.preview;
    }
  
  } 
  
/*Function to make the transfer operation*/

transfer(){
  /*Get the value of the input From account*/
 var getBalance =  (<HTMLInputElement>document.getElementById('fromAccount')).value;
 console.log(getBalance);

/*Cut the string to obtain the numeric value of the balance*/
 var balance = getBalance.substring(getBalance.indexOf("$") + 1);
 console.log('current Balance ' + balance);

 /*Get the value of the Amount to transfer*/
 var getAmount = (<HTMLInputElement>document.getElementById('amount')).value;
 console.log(getAmount);


 /*Decrease the transfered amount from the balance*/
 var newBalance = Number(balance) - Number(getAmount);
 console.log('Your balance is ' + newBalance);
 
/*Modal transfer completed */
var to =(<HTMLSelectElement>document.getElementById('toTransfer'));
var optionSelected= to.options[to.selectedIndex].text;
Swal.fire(this.translate.instant('form.sweetSuccess') +' '+ optionSelected +' '+ this.translate.instant('form.sweetSuccess2') +' '+ '$' + getAmount , this.translate.instant('form.sweetSuccess3'), 'success')

 /*Reset fields and push the new balance value into the input when the transfer has been completed*/
var afterTransferBalance = getBalance.replace(balance, newBalance.toString());
console.log(afterTransferBalance);

(<HTMLInputElement>document.getElementById('fromAccount')).value= afterTransferBalance;
(<HTMLSelectElement>document.getElementById('toTransfer')).selectedIndex = 0;
(<HTMLInputElement>document.getElementById('amount')).value= "$0.00";

/*Reset the button from transfer to submit*/
this.preview = !this.preview;

/*Add transaction line in history*/

/*Get today's date*/
  var dateHuman = new Date();
  var month = dateHuman.toLocaleString('default', { month: 'short' });
  var monthFormat = month.charAt(0).toUpperCase() + month.slice(1);
  var day = dateHuman.toLocaleString('default', { day: '2-digit' });
  var dateFinal = monthFormat + '.' + ' ' + day;

/*Add color and type of payment*/

/*Obtain color and type of payment based on the selection of the merchant*/
var elementsCount  = Object.keys(sampleData).length;
var i;
for(i = 0; i < elementsCount; i++){
  var merchant = sampleData[i].merchant.name;
  console.log(merchant);

  if(merchant === optionSelected){
    var index = i;   
  }
}

/*Assign the color and type of payment related to the merchant*/
var color = sampleData[index].categoryCode;
var typePayment = sampleData[index].transaction.type;
var logoImg = sampleData[index].logo;
$('#transactionsList tr:first').before('<tr>'+'<td style="background-color:'+ color +'">' +'</td>'+'<td class="date">'+ dateFinal +'</td>'+ '<td>'+ '<img class="logoImg" width="50" src="'+ logoImg +'"/>'+'</td>' +'<td>'+ '<b class="merchantName">' + optionSelected + '</b>'+ '<br>'+ '<small>'+ typePayment +'</small>' +'</td>'+ '<td><b class="amount">-'+ getAmount +'</b></td>'+ '</td></tr>');

}  

/*Sort by*/

sortbyMerchant(){
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("transactionsList");
    console.log(table);
    switching = true;
    
    while (switching) {   
      switching = false;
      rows = table.rows;  
      for (i = 0; i < (rows.length -1 ); i++) {        
        shouldSwitch = false;      
        x = rows[i].getElementsByClassName("merchantName")[0];
        y = rows[i + 1].getElementsByClassName("merchantName")[0];
        console.log( y.innerHTML.toLowerCase());
        console.log( x.innerHTML.toLowerCase());

        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {   
          console.log("done" + x.innerHTML.toLowerCase() + "es mayor que" + y.innerHTML.toLowerCase());      
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        console.log("estoy en should switch" + rows[i] +  rows[i+1]);
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
       
        switching = true;
      }
    
    }
}

sortbyAmount(){
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("transactionsList");
  console.log(table);
  switching = true;
  
  while (switching) {   
    switching = false;
    rows = table.rows;  
    for (i = 0; i < (rows.length -1 ); i++) {        
      shouldSwitch = false;      
      x = rows[i].getElementsByClassName("amount")[0];
      y = rows[i + 1].getElementsByClassName("amount")[0];     
      

      if (Number(Math.abs(x.innerHTML))  > Number(Math.abs(y.innerHTML))) {   
        console.log("done" + x.innerHTML.toLowerCase() + "es mayor que" + y.innerHTML.toLowerCase());      
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      console.log("estoy en should switch" + rows[i] +  rows[i+1]);
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
     
      switching = true;
    }
  
  }
}

sortbyDate(){
  var table, rows, switching, i, x, y,dateOne,dateTwo, shouldSwitch;
  table = document.getElementById("transactionsList");
  switching = true;
  
  while (switching) {   
    switching = false;
    rows = table.rows;  
    for (i = 0; i < (rows.length -1 ); i++) {      
    
      shouldSwitch = false;      
      x = rows[i].getElementsByClassName("date")[0];
      y = rows[i + 1].getElementsByClassName("date")[0];
            
      dateOne = new Date(x.innerHTML);
      dateTwo = new Date(y.innerHTML);

     console.log(dateOne + dateTwo);

      if (dateOne  > dateTwo) {   
        
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      console.log("estoy en should switch" + rows[i] +  rows[i+1]);
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
     
      switching = true;
    }
  
  }
}



ngOnInit(){ 
  /*Search bar functionality*/
  $(document).ready(function search(){
    $("#search").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#transactionsList tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
      $('.iconClear').show();     
    }); 
  }); 
}

clear() {      
    (<HTMLInputElement>document.getElementById("search")).value = "";      
    $("#transactionsList tr").filter(function() {
      var value = $(this).val().toLowerCase();
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  } 

}


