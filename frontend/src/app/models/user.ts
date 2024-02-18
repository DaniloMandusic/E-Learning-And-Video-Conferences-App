import { SafeUrl } from "@angular/platform-browser";

export class User {
    //id: string = '';
    // val: number = 0;
    username: string = '';
    password: string = '';
    securityQuestion: string = '';
    securityAnswer: string = '';
    name: string = ''
    surname: string = ''
    gender: string = ''
    address: string = ''
    phoneNumber: string = ''
    email: string = ''
    schoolType: string = ''
    grade: string = ''
    profilePicture: File = new File(["D:\\danilo\\Fax\\9 semestar\\PIA\\projekat\\frontend\\src\\app\\data\\81388322.jpg"], "profilePicture")
    profilePictureUrl: string = 'no url'
    image: any
    profileType: string = ''
    profileStatus: string = ''

    cv: File = new File(["D:\\danilo\\Fax\\9 semestar\\PIA\\projekat\\frontend\\src\\app\\data\\81388322.jpg"], "profilePicture")
    cvUrl: string = 'no cv url'
    cvImg: any
    teachingGroup: string = ''
    heardFrom: string = ''
    classes: string = ''

  }