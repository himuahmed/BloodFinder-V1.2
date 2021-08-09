import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/shared-services/user-service.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { Person } from '../interfaces/person';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExternalFileReaderService } from 'src/app/shared-services/externalFileReader.service';
import { District } from 'src/app/global-interfaces/district';
import { Division } from 'src/app/global-interfaces/division';
import { Union } from 'src/app/global-interfaces/union';
import { Upazila } from 'src/app/global-interfaces/upazila';
import { bloodGroup } from 'src/app/global-interfaces/bloodGroup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { orderBy as _orderBy, assign as _assign, filter as _filter, cloneDeep as _cloneDeep, remove as _remove } from 'lodash';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-add-person-details',
  templateUrl: './add-person-details.component.html',
  styleUrls: ['./add-person-details.component.scss']
})
export class AddPersonDetailsComponent implements OnInit,OnDestroy {

  districtPath = '../../assets/JsonFiles/districts.json';
  divisionPath = '../../assets/JsonFiles/divisions.json';
  unionsPath = '../../assets/JsonFiles/unions.json';
  upazilasPath = '../../assets/JsonFiles/upazilas.json';
  sliderColor: ThemePalette = 'accent';
  addPersonForm:FormGroup;
 
  unsubscribe$ = new Subject();
  isLoading= true;
  person:Person;
  addedPersonData:Person = {};
  hasPersonDetails = false;
  isEdit = false;
  profileUpdated = false;
  isPublicProfile:boolean;
  isEmailVisible: boolean;
  isContactNoVisible: boolean;

  bloodGroupList: bloodGroup[] = [
    {name: 'A RhD positive (A+)', value:'A+'},
    {name: 'A RhD negative (A-)', value:'A-'},
    {name: 'B RhD positive (B+)', value:'B+'},
    {name: 'B RhD negative (B-)', value:'B-'},
    {name: 'O RhD positive (O+)', value:'O+'},
    {name: 'O RhD negative (O-)', value:'O-'},
    {name: 'AB RhD positive (AB+)', value:'AB+'},
    {name: 'AB RhD negative (AB-)', value:'AB-'},
  ]
  selectedBloodGroup:string;

  districts: District[];
  divisions:Division[];
  upazila:Upazila[];
  union:Union[];
  isDivisionSelected = false;
  isDistrictChecked = false;
  isUpazilaChecked = false;
  selectedDistrict:District;
  selectedDivision:Division;
  selectedUpazila:Upazila;
  isFiltered = false;
  isAddressValid = false;
  und = undefined;


  constructor(private userService:UserServiceService,readonly snackBar: MatSnackBar, private externalFileReaderService: ExternalFileReaderService,
    private formBuilder: FormBuilder,private router:Router,private readonly titleService: Title) {
      this.titleService.setTitle("Add personal details")
     }

  ngOnInit() {
    this.getPersonByUserId();
    this.addPersonFormMethod();
    this.getDivisions();
    this.getDistricts();
    this.getUpazilas();
    //this.getAllBdLocations();
    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPersonByUserId(){
    this.userService.getPersonByUserId().pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      if(res){
        this.router.navigate(['user']);
      }
    },error=>{
      this.isLoading = false;
      this.router.navigate(['user/add-person-info']);
    });
  }

  addPersonFormMethod(){
    return this.addPersonForm = this.formBuilder.group({
      fullName:['', [Validators.required, Validators.maxLength(40), Validators.minLength(2)]],
      bloodGroup:['', [Validators.required]],
      //email:[this.person?.email, [Validators.required]],
      contactNo:['', [Validators.required,Validators.minLength(11),Validators.maxLength(11)]],
/*       division:[this.selectedDivision?this.selectedDivision.name:'', [Validators.required]],
      district:[this.selectedDistrict?this.selectedDistrict.name:'', [Validators.required]],
      union:[this.selectedUpazila?this.selectedUpazila.name:'', [Validators.required]], */
    })
  }

  addPersonData(){
    this.addedPersonData = _assign({},this.person,this.addPersonForm.value);
    this.addedPersonData.division = this.selectedDivision.name;
    this.addedPersonData.district = this.selectedDistrict.name;
    this.addedPersonData.union = this.selectedUpazila.name;
    console.log(this.addedPersonData);
    this.userService.addPersonInformation(this.addedPersonData).subscribe(res=>{
      if(res){
        this.profileUpdated = true;
        this.openSnackBar('your profile information has been added', 'close');
        this.router.navigate(['user']);
      }
    },error=>{
      this.openSnackBar('Failed to add information.', 'close');
    })
  }
  updateProfilePrivacy()
  {
    this.person.publicProfile = this.isPublicProfile;
    this.person.emailVisible = this.isEmailVisible;
    this.person.contactNoVisible = this.isContactNoVisible;
    this.addedPersonData = _assign({},this.person,this.addPersonForm.value);
    this.addPersonData();
  }

  getDivisions(){
    this.externalFileReaderService.getJsonValues(this.divisionPath).pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      this.divisions = _orderBy(res,[x=> x.name.toLowerCase()], ['asc']);
    });
  }

  getDistricts(){
    this.externalFileReaderService.getJsonValues(this.districtPath).pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      this.districts = _orderBy(res,[x=> x.name.toLowerCase()], ['asc']);
    });
  }

  getUpazilas(){
    this.externalFileReaderService.getJsonValues(this.upazilasPath).pipe(takeUntil(this.unsubscribe$)).subscribe(res=>{
      this.upazila = _orderBy(res,[x=> x.name.toLowerCase()], ['asc']);
    });
  }

  divisionChecked(){
    this.isDivisionSelected = true;
    this.addedPersonData['division'] = this.selectedDivision['name'];
    this.districts = _filter(this.districts, district=> district.division_id == this.selectedDivision.id);
    this.upazila = this.filterObjsInArr(this.upazila, this.districts);
    this.addressChecked();
    console.log(this.addedPersonData);
    console.log('Upazilla list:');
    console.log(this.upazila);
  }

 
  districteChecked(){
    this.isDistrictChecked = true;
    this.addedPersonData['district'] = this.selectedDistrict['name'];
    this.upazila = _filter(this.upazila, u=> u.district_id == this.selectedDistrict.id);
    this.selectedDivision = _filter(this.divisions, u=> u.id == this.selectedDistrict.division_id)[0];
    this.addressChecked();
    this.isDivisionSelected = true;
  }


  upazilaChecked(){
    this.isUpazilaChecked = true;
    this.addedPersonData['union'] = this.selectedUpazila['name'];
    this.selectedDistrict = _filter(this.districts, district=> district.id == this.selectedUpazila.district_id)[0];
    this.selectedDivision = _filter(this.divisions, u=> u.id == this.selectedDistrict.division_id)[0];
    this.addressChecked();
    this.isDistrictChecked = true;
    this.isDivisionSelected = true;
  }

  filterObjsInArr(arr, selection) {
    let tempArr = _cloneDeep(arr);
    tempArr = [];
    let tempArr2 = [];
    for(let item of selection){
      for (let arrItem of arr){
        if(item['id'] === arrItem['district_id']){
          tempArr2.push(arrItem);
        }
      }
    }
    return tempArr2;
    
  }

  addressChecked(){
    if(this.selectedUpazila && this.selectedDistrict && this.selectedDivision){
      debugger
     this.isAddressValid = true;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action,{
      duration: 2*1000
    });
    this.isLoading = false;
  }

}
