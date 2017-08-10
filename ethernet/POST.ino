#include <Ethernet.h>
#include <SPI.h>

byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x01 }; // RESERVED MAC ADDRESS
EthernetClient client;

long previousMillis = 0;
unsigned long currentMillis = 0;
long interval = 3000; // READING INTERVAL
int p = 0;
String data;

void setup() { 
	Serial.begin(9600);

	if (Ethernet.begin(mac) == 0) {
		Serial.println("Failed to configure Ethernet using DHCP"); 
	}

	delay(10000); // GIVE THE SENSOR SOME TIME TO START

	data = "potentio=";
}

void loop(){

	currentMillis = millis();
	if(currentMillis - previousMillis > interval) { // READ ONLY ONCE PER INTERVAL
		previousMillis = currentMillis;
		p = (int) analogRead(A0) * (5.0 / 1023.0); // CONVERT TO ARDUINO READABLE VALUE;
	}

	data = data + p;

	if (client.connect("167.205.43.205",3000)) { // REPLACE WITH YOUR SERVER ADDRESS
		client.println("POST /results HTTP/1.1"); 
		client.println("Host: 167.205.43.205:3000"); // SERVER ADDRESS HERE TOO
		client.println("Content-Type: application/x-www-form-urlencoded"); 
		client.print("Content-Length: "); 
		client.println(data.length()); 
		client.println(); 
		client.print(data); 
	} 

	if (client.connected()) { 
		client.stop();	// DISCONNECT FROM THE SERVER
	}

	delay(5000); // 5 seconds
}



