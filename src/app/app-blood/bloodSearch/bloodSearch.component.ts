import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { District } from 'src/app/global-interfaces/district';
import { Division } from 'src/app/global-interfaces/division';
import { Upazila } from 'src/app/global-interfaces/upazila';
import { bloodGroup } from 'src/app/global-interfaces/bloodGroup';
import { ExternalFileReaderService } from 'src/app/shared-services/externalFileReader.service';
import { orderBy as _orderBy, assign as _assign, filter as _filter, cloneDeep as _cloneDeep, remove as _remove } from 'lodash';
import * as _ from 'lodash';
import { BloodsearchService } from '../services/bloodsearch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { bounceInRightOnEnterAnimation} from 'angular-animations';
import { UserServiceService } from 'src/app/shared-services/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SendMessageDialogComponent } from 'src/app/SharedComponents/send-message-dialog/send-message-dialog.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bloodSearch',
  templateUrl: './bloodSearch.component.html',
  styleUrls: ['./bloodSearch.component.scss'],
  animations: [
    bounceInRightOnEnterAnimation()
  ]
})

export class BloodSearchComponent implements OnInit,OnDestroy {
  districtPath = '../../assets/JsonFiles/districts.json';
  divisionPath = '../../assets/JsonFiles/divisions.json';
  unionsPath = '../../assets/JsonFiles/unions.json';
  upazilasPath = '../../assets/JsonFiles/upazilas.json';

  unsubscribe$ = new Subject();
  districts: District[];
  divisions:Division[];
  upazila:Upazila[];
  //union:Union[];
  isDivisionSelected = false;
  isDistrictChecked = false;
  isUpazilaChecked = false;
  selectedDistrict:District;
  selectedDivision:Division;
  selectedUpazila:Upazila;
  isLoading = true;
  isFiltered = false;
  loggedInUserId:string;

  totalBloodDonors:number;
  bloodDonorPageSize:number;

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
  
  displayedColumns: string[] = ['bloodgroup', 'name', 'email', 'contact', 'division', 'district', 'upazila', 'sendMessage'/* , 'contactNow' */];
  //persolList: Person[] = [];
  personList = new MatTableDataSource<any>([]);
  totalPerson = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private externalFileReaderService:ExternalFileReaderService, private bloodSearchService: BloodsearchService,
    readonly snackBar: MatSnackBar, private userService: UserServiceService, public dialog: MatDialog,private authService:AuthService,
     private router:Router) { }
  //AIzaSyA3tHeCwkt4eXWSAHxWFpx2KzgVfIXfhQE
  ngOnInit() {
    //this.getAllBdLocations();
    if(this.authService.isLoggedIn()){
      this.loggedInUserId = this.userService.getLoggedinUserId();
    }
    this.getDistricts();
    this.getDivisions();
    this.getUpazilas();
    this.getAllBloodDonors();
  }

  ngAfterViewInit(): void {
    this.personList.paginator = this.paginator;
}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action,{
      duration: 2*1000
    });
    this.isLoading = false;
  }
  openMessageDialog(receiverId, name) {
    if(this.authService.isLoggedIn()){
      this.dialog.open(SendMessageDialogComponent,{
        data:{userId: receiverId, name: name},
      });
    }
    else{
      this.router.navigate(['auth']);
    }

  }

  resetSearch(){
    this.isFiltered = false;
    this.selectedBloodGroup = undefined;
    this.selectedDistrict = undefined;
    this.selectedDivision = undefined;
    this.selectedUpazila = undefined;
    this.isDivisionSelected = false;
    this.isDistrictChecked = false;
    this.isUpazilaChecked = false;
    this.getDivisions();
    this.getDistricts();
    this.getUpazilas();
    this.getAllBloodDonors();
    this.personList = new MatTableDataSource<any>([]);
    this.personList.paginator = this.paginator;
    this.isLoading = false;
  }

 

  sendMessage(receiverId){
    console.log("himuuuuuuuuuuuuuuuuuuuuu" + receiverId);
    let x =  this.userService.getLoggedinUserId();
    console.log(x);
  }

  multiFactorPersonFilter(){
    console.log("executed");
    debugger
    if(this.selectedUpazila && this.selectedBloodGroup){
      this.getPersonByUpazillaAndBloodGroup(this.selectedUpazila.name, this.selectedBloodGroup);
    }
    else if(this.selectedDistrict && this.selectedBloodGroup){
      this.getPersonByDistrictAndBloodGroup(this.selectedDistrict.name, this.selectedBloodGroup);
    }
    else if(this.selectedDivision && this.selectedBloodGroup){
      this.getPersonByDivisionAndBloodGroup(this.selectedDivision.name, this.selectedBloodGroup);
    }
    else if(this.selectedBloodGroup && !this.selectedDistrict && !this.selectedDivision && !this.selectedUpazila){
      debugger
      this.getPersonByBloodGroup(this.selectedBloodGroup);
    }
  }

  getAllBloodDonors(pageNumber?, pageSize?){
    return this.bloodSearchService.getAllBloodDonors(pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log('all blood donors');
       console.log(res);
       this.personList.data = res.result;
       this.totalBloodDonors = res.pagination['totalCount'];
       console.log(this.totalBloodDonors);
     }
    });
  }

  getPersonByBloodGroup(bloodGroup, pageNumber?, pageSize?){
    if(bloodGroup.slice(-1)=== '+'){
      bloodGroup = bloodGroup.replace(bloodGroup.slice(-1), "positive");
    }
    return this.bloodSearchService.getPersonsByBloodGroup(bloodGroup, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByDivision(division, pageNumber?, pageSize?){
    return this.bloodSearchService.getPersonsByDivision(division, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByDivisionAndBloodGroup(division, bloodGroup, pageNumber?, pageSize?){
    if(bloodGroup.slice(-1)=== '+'){
      bloodGroup = bloodGroup.replace(bloodGroup.slice(-1), "positive");
    }
    return this.bloodSearchService.getPersonsByDivisionAndBloodGroup(division, bloodGroup, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByDistrict(district, pageNumber?, pageSize?){
    return this.bloodSearchService.getPersonsByDistrict(district, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByDistrictAndBloodGroup(district, bloodGroup, pageNumber?, pageSize?){
    if(bloodGroup.slice(-1)=== '+'){
      bloodGroup = bloodGroup.replace(bloodGroup.slice(-1), "positive");
    }
    return this.bloodSearchService.getPersonsByDistrictAndBloodGroup(district, bloodGroup, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByUpazilla(upazilla, pageNumber?, pageSize?){
    return this.bloodSearchService.getPersonsByUpazilla(upazilla, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  getPersonByUpazillaAndBloodGroup(district,bloodGroup, pageNumber?, pageSize?){
    if(bloodGroup.slice(-1)=== '+'){
      bloodGroup = bloodGroup.replace(bloodGroup.slice(-1), "positive");
    }
    return this.bloodSearchService.getPersonsByUpazillaAndBloodGroup(district, bloodGroup, pageNumber, pageSize).subscribe(res=> {
     if(res){
       console.log(res);
       this.personList.data = res.result;
     }
    });
  }

  divisionChecked(){
    this.isDivisionSelected = true
    this.districts = _filter(this.districts, district=> district.division_id == this.selectedDivision.id);
    this.upazila = this.filterObjsInArr(this.upazila, this.districts);
    console.log(this.districts);
    console.log('Upazilla list:');
    console.log(this.upazila);
  }

 
  districteChecked(){
    this.isDistrictChecked = true;
    this.upazila = _filter(this.upazila, u=> u.district_id == this.selectedDistrict.id);
    this.selectedDivision = _filter(this.divisions, u=> u.id == this.selectedDistrict.division_id)[0];
    debugger;
    this.isDivisionSelected = true;
  }


  upazilaChecked(){
    this.isUpazilaChecked = true;
    this.selectedDistrict = _filter(this.districts, district=> district.id == this.selectedUpazila.district_id)[0];
    this.selectedDivision = _filter(this.divisions, u=> u.id == this.selectedDistrict.division_id)[0];
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
 


  
}
