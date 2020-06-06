import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';


declare const Paho: any;
declare const document: any;

@Injectable({providedIn: "root"})

export class MqttInterfaceService {


  private status: string[] = ['connecting', 'connected', 'disconnected'];
  public mqttStatus = new BehaviorSubject(status[2]);
  public client: any;
  private scripts: any = {};
  private ScriptStore: Scripts[] = [
    {
      name: 'paho_mqtt', src: 'https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js'
    }
  ];

  constructor() {
    this.ScriptStore.forEach((script: any) => {
        this.scripts[script.name] = {
            loaded: false,
            src: script.src
        };
    });
  }

  
  private _load(...scripts: string[]) {
      var promises: any[] = [];
      scripts.forEach((script) => promises.push(this._loadScript(script)));
      return Promise.all(promises);
  }

  private _loadScript(name: string) {
      return new Promise((resolve, reject) => {
          //resolve if already loaded
          if (this.scripts[name].loaded) {
              resolve({name, loaded: true, status: 'Already Loaded'});
          }
          else {
              //load script
              let script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = this.scripts[name].src;
              if (script.readyState) {  //IE
                  script.onreadystatechange = () => {
                      if (script.readyState === "loaded" || script.readyState === "complete") {
                          script.onreadystatechange = null;
                          this.scripts[name].loaded = true;
                          resolve({name, loaded: true, status: 'Loaded', script, src: script.src});
                      }
                  };
              } else {  //Others
                  script.onload = () => {
                      this.scripts[name].loaded = true;
                      resolve({name, loaded: true, status: 'Loaded', script, src: script.src});
                  };
              }
              script.onerror = (error: any) => resolve({name, loaded: false, status: 'Loaded'});
              document.getElementsByTagName('head')[0].appendChild(script);
          }
      });
  }

  public createClient(
    onConnectionLost,
    onMessageArrived, 
    TOPIC: string[], 
    MQTT_CONFIG: {
      host: string,
      port: number,
      clientId: string,
      path?: string,
    }): any {
    return this._load('paho_mqtt').then(data => {
      this.mqttStatus.next(this.status[0]);
      this.client = new Paho.Client(MQTT_CONFIG.host, Number(MQTT_CONFIG.port), MQTT_CONFIG.path || "/mqtt", MQTT_CONFIG.clientId);
      this.client.onConnectionLost = onConnectionLost.bind(this);
      this.client.onMessageArrived = onMessageArrived.bind(this);
      return this.client.connect(
        {
          onSuccess: this._onConnect.bind(this, TOPIC),
          onFailure: this._onConnectionFailure.bind(this)
      });
    }).catch(error => {
   
    })
  };

  public publishMessage(topic: string, playload: string, qos?: number, retained?: boolean): void {
      console.log('msg, topic', topic, playload);
      var message = new Paho.Message(playload);
      message.topic = topic;
      qos ? message.qos = qos : 1;
      qos ? message.retained = retained : false;
      this.client.publish(message);
    };

  public publishUpdate(topic: string, payload: string): void {
    var message = new Paho.Message(payload);
    message.topic = topic;
    message.qos = 2;
    message.retained = true;
    this.client.publish(message);
  }

  private _onConnect(topic: string[]) {
    topic.forEach((tp) => {
      this.client.subscribe(tp);
    });
    this.mqttStatus.next(this.status[1]);
    return this.client;
  }

  _onConnectionFailure(){
    console.log("Error");
  }

  public disconnectClient() {
    this.client.disconnect();
    this.mqttStatus.next(this.status[2]);
  }
}


interface Scripts {
   name: string;
   src: string;
}
