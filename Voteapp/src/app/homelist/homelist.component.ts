import { Component, OnInit, DefaultIterableDiffer } from '@angular/core';
import { CommonService } from '../service/common.service';
import { NotificationService } from '../service/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-homelist',
  templateUrl: './homelist.component.html',
  styleUrls: ['./homelist.component.css']
})
export class HomelistComponent implements OnInit {

  subscribedData: any;
  listData: any;
  clicked: boolean = false;
  currentrecipe: any;
  voteform: FormGroup;
  loginform: FormGroup;
  candidateform: FormGroup;
  loggedin: boolean = false;
  candidatecrud: boolean = false;
  candidateedit: boolean = false;
  local: any;
  editmodel: boolean = false;

  constructor(public _service: CommonService,
    private _router: Router,
    private formBuilder: FormBuilder,
    public _notification: NotificationService,) { }

  // for reactive form validation we use this in html code
  get formcontrols() { return this.voteform.controls; }

  get canndidateformcontrols() { return this.candidateform.controls; }

  ngOnInit() {
    debugger

    if (JSON.parse(localStorage.getItem("details"))) {
      this.local = JSON.parse(localStorage.getItem("details"));
      this.loggedin = true
      this.candidatecrud = this.local['role'] == "admin" ? true : false;
      this.candidateedit = this.local['role'] == "candidate" ? true : false;
    }
    this.voteform = this.formBuilder.group({
      name: [''],
      challengessolved: [''],
      ds: [''],
      algorithm: [''],
      c: [''],
      java: [''],
      phyton: [''],
    });
    this.loginform = this.formBuilder.group({
      username: [''],
      password: [''],
    });
    this.candidateform = this.formBuilder.group({
      candidateid: [''],
      name: [''],
      password: [''],
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

  getcandidate() {
    this.subscribedData = this._service.getList('api/Candidate').subscribe(
      (response) => {
        debugger;
        let data = [];
        this.listData = response;
        data = this.listData;
        this.listData = data.filter(data => data['role'] === "candidate");
        console.log(this.listData)
      }, (error) => {

      })
  }
  transferid(id) {
    debugger
    if (id == "" || id == undefined || id == null) {
      id = JSON.parse(localStorage.getItem("details"))['candidateid']
      this.editmodel = true;
    }
    this.subscribedData = this._service.getById(id, 'api/Candidate').subscribe(
      (response) => {
        debugger;
        if (this.editmodel) {
          this.candidateform.patchValue(response);
          this.voteform.patchValue(response);
        }
        else {
          this.voteform.patchValue(response);
        }
        console.log(response)
      }, (error) => {

      })
  }

  valuefromchild(fromchlid) {
    this.clicked = fromchlid
  }

  vote(votedforid) {
    debugger;
    if (!this.loggedin) {
      let msg = {
        messagestype: 2,
        messages: "Please Login To Vote!!"
      }
      this._notification.shownotification(msg)
    }
    else {
      let localdata = JSON.parse(localStorage.getItem("details"))
      if (localdata['voted']) {
        let msg = {
          messagestype: 2,
          messages: "You have already voted!!!"
        }
        this._notification.shownotification(msg)
      }
      else {
        let votedata = {
          whovoted: localdata['candidateid'],
          votedfor: votedforid
        }
        this.subscribedData = this._service.insert(votedata, 'api/values').subscribe(
          (response) => {
            debugger;
            localStorage.setItem("details", JSON.stringify(response))
            this.listData=null;
            this.getcandidate();
            let msg = {
              messagestype: 1,
              messages: "You have voted succesfully"
            }
            this._notification.shownotification(msg)
          }, (error) => {

          })
      }
    }
  }

  update(id) {
    debugger
    this.subscribedData = this._service.update(id, this.candidateform.value, 'api/Candidate').subscribe(
      (response) => {
        debugger;
        this.listData=null
        this.getcandidate()
        let msg = {
          messagestype: 1,
          messages: "Your details updated succesfully!!!"
        }
        this._notification.shownotification(msg)
      }, (error) => {

      })
    this.candidateform.reset()
    $("#myModaledit").modal("hide");
  }

  login() {

    this.subscribedData = this._service.insert(this.loginform.value, 'api/User').subscribe(
      (response) => {
        debugger;
        if (response['candidateid'] != null) {
          localStorage.setItem("details", JSON.stringify(response))
          this.loggedin = true;
          if (response['role'] == "admin") {
            this.candidatecrud = true;
          } else {
            this.candidateedit = true;
          }
          console.log(response)
        } else {
          let msg = {
            messagestype: 2,
            messages: "Username or password is incorrect"
          }
          this._notification.shownotification(msg)

        }
      }, (error) => {

      })
    this.loginform.reset()
    $("#myModal").modal("hide");
  }

  logout() {
    localStorage.clear();
    this.loggedin = false;
    this.candidatecrud = false;
    this.candidateedit = false;
    this.voteform.reset();
    this.candidateform.reset();
  }

  ngOnDestroy() {
    this.subscribedData.unsubscribe();

  }
}