import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploadDirComponent } from './files-upload-dir.component';

describe('FilesUploadDirComponent', () => {
  let component: FilesUploadDirComponent;
  let fixture: ComponentFixture<FilesUploadDirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesUploadDirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesUploadDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
