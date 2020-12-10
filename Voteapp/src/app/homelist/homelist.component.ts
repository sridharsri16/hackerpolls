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
      this.candidatecrud = this.local['isadmin'] == true ? true : false;
      this.candidateedit = this.local['isadmin'] == false ? true : false;
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
      name: [''],
      password: [''],
    });
    this.candidateform = this.formBuilder.group({
      id: [''],
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
    this.subscribedData = this._service.getList('api/candidate').subscribe(
      (response) => {
        debugger;
        console.log(response)
        let data = [];
        this.listData = response;
        data = this.listData;
        this.listData = data.filter(data => data['isadmin'] === false);
        console.log(this.listData)
      }, (error) => {

      })
  }
  transferid(id) {
    debugger
    if (id == "" || id == undefined || id == null) {
      id = JSON.parse(localStorage.getItem("details"))['loginid']
      this.editmodel = true;
    }
    this.subscribedData = this._service.getById(id, 'api/candidate').subscribe(
      (response) => {
        console.log(response)
        debugger;
        if (this.editmodel) {
          this.candidateform.patchValue(response);
          this.candidateform.patchValue(response['candidatedetail']);
          this.voteform.patchValue(response);
          this.voteform.patchValue(response['candidatedetail']);
        }
        else {
          this.voteform.patchValue(response);
          this.voteform.patchValue(response['candidatedetail']);
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
          "whovoted": !localdata['id'] ? localdata['loginid'].toString() : localdata['id'].toString(),
          "votedfor": votedforid.toString()
        }
        this.subscribedData = this._service.insert(votedata, 'api/vote').subscribe(
          (response) => {
            debugger;
            console.log(response)
            localStorage.setItem("details", JSON.stringify(response))
            this.listData = null;
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
    this.subscribedData = this._service.update(id, this.candidateform.value, 'api/candidate').subscribe(
      (response) => {
        debugger;
        console.log(response)
        this.listData = null
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

    this.subscribedData = this._service.insert(this.loginform.value, 'api/user').subscribe(
      (response) => {
        debugger;
        console.log(response)
        if (response['candidateid'] != null || response['id'] != null) {
          localStorage.setItem("details", JSON.stringify(response))
          this.loggedin = true;
          if (response['isadmin'] == true) {
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
