import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { HomeComponent } from './home.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from '../app.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
          ReactiveFormsModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('h2 displays: All registered users:', () => {
    const compiled = fixture.debugElement.nativeElement;    
    expect(compiled.querySelector('.users__sub-title').textContent).toContain('All registered users:');
  });
  
});












// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {HttpClientModule} from '@angular/common/http';

// import { HomeComponent } from './home.component';
// import {RouterTestingModule} from '@angular/router/testing';
// import {AppComponent} from '../app.component';




// describe('HomeComponent', () => {
//   let component: HomeComponent;
//   let fixture: ComponentFixture<HomeComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ 
//         HomeComponent 
//       ],
//       imports: [
//         FormsModule,
//         HttpClientModule,
//         ReactiveFormsModule,
//         RouterTestingModule,
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(HomeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   // it('should create', () => {
//   //   expect(component).toBeTruthy();
//   // });

//   // it('should render title in a h1 tag', () => {
//   //   const compiled = fixture.debugElement.nativeElement;
//   //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to The HRS Angular Coding Challenge!');
//   // });
// });
