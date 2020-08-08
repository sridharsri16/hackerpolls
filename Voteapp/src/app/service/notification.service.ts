import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  UpdateConfirm: any;
  DeleteConfirm: any;
  DeleteAllRelatedRecordConfirm: any;
  confirmation: any;

  constructor() {
  }
  Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    showCloseButton: true,
  });


  shownotification(messageDetail: any) {
    if (messageDetail.messagestype == "1")
      this.success(messageDetail.messages);
    else if (messageDetail.messagestype == "2")
      this.error(messageDetail.messages);
  }

  success(msg: string) {
    this.Toast.fire({
      title: msg,
      icon: 'success'
    })
  }

  error(msg: string) {
    this.Toast.fire({
      title: msg,
      icon: 'error'
    })
  }
}
