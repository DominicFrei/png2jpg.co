import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: 'AIzaSyBEwAdcBK_lmkrYP8ofvB5ubywXs8H3hsQ',
	authDomain: 'png2jpg-co.firebaseapp.com',
	projectId: 'png2jpg-co',
	storageBucket: 'png2jpg-co.firebasestorage.app',
	messagingSenderId: '798745792514',
	appId: '1:798745792514:web:e94a19ea67c37d3db2d71b',
	measurementId: 'G-K81PWZN5X9'
};

const app = initializeApp(firebaseConfig);

let analytics: Analytics | undefined;
if (browser) {
	analytics = getAnalytics(app);
}

export { app, analytics };
