export interface IEnvironments {
  production: boolean;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  cloudionaryConfig: {
    cloudName: 'dtawrrhhd';
    uploadPreset: 'ml_default';
  };
}
