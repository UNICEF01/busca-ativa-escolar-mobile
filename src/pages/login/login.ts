import {Component, Inject, OnInit} from '@angular/core';

import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {AuthService} from "../../providers/auth.service";
import {APIService} from "../../providers/api.service";
import {DashboardPage} from "../dashboard/dashboard";
import {AppSettingsService} from "../../providers/settings.service";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

	loader: any;

	constructor(
		public navCtrl: NavController,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController,
		public auth: AuthService,
		public api: APIService,
		public settings: AppSettingsService,
	) {}

	ngOnInit() {

	}

	setLoading(message) {
		this.loader = this.loadCtrl.create({
			content: message,
		});

		this.loader.onDidDismiss(() => {
			this.loader = null;
		});

		this.loader.present();
	}

	setIdle() {
		if(!this.loader) return;
		this.loader.dismiss();
	}

	login(email: string, password: string) {
		this.setLoading("Autenticando...");
		this.auth.login(email, password).then(this.onLogin.bind(this), this.onError.bind(this));
	}

	onLogin(data: any) {
		this.setIdle();
		console.log("Logged in: ", data);
		this.navCtrl.setRoot(DashboardPage);
	}

	onError(data: any) {
		this.setIdle();
		console.error("Error: ", data);

		if(data && data.error === 'invalid_credentials') {

			this.alertCtrl.create({
				title: 'Usuário ou senha inválidos!',
				subTitle: 'Verifique se os dados digitados estão corretos, e tente novamente.',
				buttons: ['OK']
			}).present();

			return;
		}

		this.alertCtrl.create({
			title: 'Conexão indisponível!',
			subTitle: 'Verifique se sua conexão com a internet está habilitada, e tente novamente.',
			buttons: ['OK']
		}).present();

	}

}
