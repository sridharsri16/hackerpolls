import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
declare var $: any;
@Component({
  selector: 'app-candidatecrud',
  templateUrl: './candidatecrud.component.html',
  styleUrls: ['./candidatecrud.component.css']
})
export class CandidatecrudComponent implements OnInit {
  subscribedData: any;
  listData: any;
  candidateform: FormGroup;
  role: string;
  constructor(public _service: CommonService,
    private _router: Router,
    private formBuilder: FormBuilder,
    public _notification: NotificationService,) { }


  // for reactive form validation we use this in html code
  get formcontrols() { return this.candidateform.controls; }

  ngOnInit(): void {
    this.candidateform = this.formBuilder.group({
      name: [''],
      password: [],
      challengessolved: [''],
      expertlevel: [''],
      ds: [''],
      algorithm: [''],
      c: [''],
      java: [''],
      phyton: [''],
      role: ['']
    });
    this.getcandidate();
  }

  valuechange(event) {
    debugger
    if (event.target.checked) {
      this.candidateform.controls.challengessolved.disable();
      this.candidateform.controls.expertlevel.disable();
      this.candidateform.controls.ds.disable();
      this.candidateform.controls.algorithm.disable();
      this.candidateform.controls.c.disable();
      this.candidateform.controls.java.disable();
      this.candidateform.controls.phyton.disable();
      this.role = "admin";
    }
    else {
      this.candidateform.enable();
      this.role = "candidate";
    }
  }

  getcandidate() {
    this.subscribedData = this._service.getList('api/candidate').subscribe(
      (response) => {
        console.log("candidate", response)
        debugger;
        let data = [];
        this.listData = response;
        data = this.listData;
        this.listData = data.filter(data => data['isadmin'] === false);
        console.log(this.listData)
      }, (error) => {

      })
  }

  insert() {
    debugger
    // let data = [];
    // data.push(this.candidateform.value);
    this.candidateform.value['role'] =
      this.role == "admin" ? this.role : "candidate";
    this.subscribedData = this._service.insert(this.candidateform.value, 'api/candidate').subscribe(
      (response) => {
        console.log(response)
        debugger;
        this.getcandidate()
        let msg = {
          messagestype: 1,
          messages: "Details inserted successfully"
        }
        this._notification.shownotification(msg)
      }, (error) => {

      })
    this.candidateform.reset()
    $("#myModal").modal("hide");
  }

  delete(id) {
    this.subscribedData = this._service.delete(id, 'api/candidate').subscribe(
      (response) => {
        console.log(response)
        debugger;
        this.getcandidate();
        let msg = {
          messagestype: 1,
          messages: "Deleted Successfully"
        }
        this._notification.shownotification(msg)
      }, (error) => {

      })
  }
}
