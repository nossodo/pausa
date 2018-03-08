import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { ToastController} from "ionic-angular";
import { Platform } from "ionic-angular";

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  circleColors;
  currenCircleColor;
  minutes;
  seconds;
  timerRunning;
  up;
  startDisabled;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              private nativeAudio: NativeAudio, private vibration: Vibration, private toastCtrl: ToastController, private platform: Platform) {
    this.circleColors = [
      {'border':'4px solid green'},
      {'border':'4px solid yellow'},
      {'border':'4px solid red'}
    ]
    this.currenCircleColor = this.circleColors[0];
    this.reset();
    this.platform.ready().then((readySource) => {
      this.nativeAudio.preloadSimple('short', 'assets/sound/short.mp3');
      this.nativeAudio.preloadSimple('long', 'assets/sound/long.mp3');
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  startStop() {
    this.vibration.vibrate(40);
    if (this.timerRunning) {
      if (this.minutes != 0 || this.seconds > 0) {
        this.up = false;
        this.currenCircleColor = this.circleColors[1];
      }
    }
    else {
      if (this.minutes == 0 && this.seconds == 0 && !this.startDisabled) {
        this.timerRunning = true;
        this.currenCircleColor = this.circleColors[2];
        this.timerTick();
      }
    }
  }

  alterTime(e) {
    if (this.timerRunning && (this.minutes != 0 || this.seconds > 0)) {
      if (e.direction == '2') {
        this.minutes += 1;
      } else if (e.direction == '4') {
        if (this.minutes >= 1) {
          this.minutes -= 1;
        }
      }
    }
  }

  options() {
    this.vibration.vibrate(40);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Roll Dices',
          handler: () => {
            this.rollDices();
          },
          cssClass: 'reset-button'
        },
        {
          text: 'Reset',
          handler: () => {
            this.reset();
          },
          cssClass: 'reset-button'
        }
      ]
    });
    actionSheet.present();
  }

  timerTick() {
    setTimeout(() => {
      if (this.timerRunning) {
        if (this.up) {
          if (this.seconds != 59) {
            this.seconds++;
          }
          else {
            this.minutes++;
            this.seconds = 0;
          }
        }
        else {
          if (this.minutes == 0 && (this.seconds==11 || (this.seconds<=4 && this.seconds>=2))) {
            this.playSound('short');
          }
          if (this.minutes > 0 && this.seconds == 0) {
            this.minutes--;
            this.seconds = 59;
          }
          else if (this.minutes == 0 && this.seconds == 1) {
            this.disableStart();
            this.playSound('long');
            this.reset();
          }
          else {
            this.seconds--;
          }
        }
        this.timerTick();
      }
    }, 1000);
  }

  reset() {
    this.timerRunning = false;
    this.currenCircleColor = this.circleColors[0];
    this.minutes = 0;
    this.seconds = 0;
    this.up = true;
  }

  rollDices() {
    let eyes = Math.floor((Math.random() * 6) + 1) + Math.floor((Math.random() * 6) + 1);
    this.presentToast("You got " + eyes);
  }

  playSound(sound) {
    this.nativeAudio.play(sound);
  }

  disableStart() {
    console.log('disabled start');
    this.startDisabled = true;
    setTimeout(() => {
      this.startDisabled = false;
    }, 1000);
  }

  presentToast(toastMessage) {
    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 4000,
      position: 'top',
      cssClass: "toastCenter"
    });

    toast.present();
  }
}
