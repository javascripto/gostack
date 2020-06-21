import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.111:3333',
});

export default api;

/**
* iOS com Emulador: localhost
* iOS com dispositivo físico: IP da máquina (ifconfig/ipconfig)
* Android com emulador: localhost (adb reverse)
* Android com emulador Android Studio: 10.0.2.2 (adb reverse tcp:3333 tcp:3333)
* Android com emulador Geanymotion: 10.0.3.2
* Android com dispositivo físico: IP da máquina 192.168.0.111
*/
