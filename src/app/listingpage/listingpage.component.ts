import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../_service/api.service';
import { AuthService } from '../modules/auth/_services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AWSHTTPService } from '../../app/modules/auth/_services/aws-http.service';
import { subscribeOn } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import {NgForm} from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

let $this;
@Component({
  selector: 'app-listingpage',
  templateUrl: './listingpage.component.html',
  styleUrls: ['./listingpage.component.scss']
})

export class ListingpageComponent implements OnInit {

  ingredient_title:string = '';
  ingredient_image:string = '';
  ingredient_id:number = 0;
  ingredients:any = [];
  fat:any = {};
  cal:any = {};
  carb:any = {};

  filedata:any;
  imageSource;

  constructor(
    private apiService: APIService,
    private auth: AuthService,
    private router : Router,
    private detector: ChangeDetectorRef,
    private http : HttpClient,
    private awshttp: AWSHTTPService,
    private sanitizer: DomSanitizer
  ) {
    $this = this;
   }

  ngOnInit(): void {
    this.GetItems();
    // this.ingredients = [{image:'../../assets/media/images/banana.jpg', title:'Banana'}]
    this.fat = {unit:'',name:'',amount:''};
    this.cal = {unit:'',name:'',amount:''};
    this.carb = {unit:'',name:'',amount:''};  
  }

  openmodal(){
    document.getElementById('NewRecord').style.display = 'block';
  }

  hidemodal(){
    this.ingredient_title = '';
    this.ingredient_image = '';
    this.ingredient_id = 0;
    this.fat = {unit:'',name:'',amount:''};
    this.cal = {unit:'',name:'',amount:''};
    this.carb = {unit:'',name:'',amount:''};  
    document.getElementById('NewRecord').style.display = 'none';
  }

  GetNutrionInfo(){
    this.ingredient_title = (<HTMLInputElement>document.getElementById('ing_title')).value;
    if(this.ingredient_title != undefined || this.ingredient_title != '' || this.ingredient_title != null){
      this.apiService.GetIngredientID(this.ingredient_title).subscribe((data) => {
        if(data.results.length > 0){
          this.ingredient_id = data.results[0].id;
          this.GetNutrificationInfo();
        }
      });
    }
    this.detector.detectChanges();
  }

  logout() {
    localStorage.removeItem(`${environment.appVersion}-${environment.USERDATA_KEY}`);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  GetNutrificationInfo(){
    this.apiService.GetIngrediantInfo(this.ingredient_id.toString()).subscribe((ing_data) => {
      this.fat = ing_data.nutrition.nutrients.filter(x => x.name == 'Fat')[0];
      this.cal = ing_data.nutrition.nutrients.filter(x => x.name == 'Calories')[0];
      this.carb = ing_data.nutrition.nutrients.filter(x => x.name == 'Carbohydrates')[0];
      this.detector.detectChanges();
    });
  }

  GetItems(){
    this.awshttp.Getitems().subscribe((data) => {
      data.body.map((item) => {
        // item.image = this.sanitizer.bypassSecurityTrustResourceUrl(`${item.image}`)
        this.ingredients.push(item);
        return item;
      })
      this.detector.detectChanges();
    })
  }

  PutItem(){
    var item = {
      item:'',
      image: null,
      nutrients: ''
    };
    item.item = this.ingredient_title;
    item.image = this.ingredient_image;
    item.nutrients = 
      'Fat (' + this.fat.unit + ') : ' + this.fat.amount + '<br>' + 
      'Calories (' + this.cal.unit + ') : ' + this.cal.amount + '<br>' + 
      'Carbohydrates (' + this.carb.unit + ') : ' + this.carb.amount + '<br>'
    this.awshttp.PutItem(item).subscribe((data) => {
      this.hidemodal();
      this.ingredients=[];
      this.GetItems();
    });
  }

  EditItem(item){
    this.ingredient_title = item.item;
    this.ingredient_image = item.image;
    this.GetItemData();
    this.openmodal();
    this.detector.detectChanges();
  }

  DeleteItem(ing){
    var item = {
      item:'',
    };
    item.item = ing;
    this.awshttp.DeleteItem(item).subscribe((data) => {
      this.ingredients=[];
        this.GetItems();
    });
  }

  fileEvent(e){
    const file: File = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Will send reader.result to API. It is base64 code
      // console.log('Result-> ',reader.result);
      this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`${reader.result}`);
      this.ingredient_image = reader.result.toString();
      console.log('imageSource: ',this.imageSource)
    };  
  }

  GetItemData(){
    if(this.ingredient_title != undefined || this.ingredient_title != '' || this.ingredient_title != null){
      this.apiService.GetIngredientID(this.ingredient_title).subscribe((data) => {
        if(data.results.length > 0){
          this.ingredient_id = data.results[0].id;
          this.GetNutrificationInfo();
        }
      });
    }
    this.detector.detectChanges();
  }
}
