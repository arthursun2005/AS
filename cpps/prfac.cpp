#include <iostream>
#include <cmath>
using namespace std;
int isPrime(double n){
	for(double i=2;i<=sqrt(n);++i){
		if(round(n/i) == n/i){
			return false;
		}
	}
	return true;
}
void fac(){
	double n;
	if(!(cin >> n)){
		cout << "Enter a integer only" << endl;
		cin.clear();
      	cin.ignore(1000,'\n');
		return;
	}
	long _n = n;
	int i = 2;
	cout << to_string(_n) << " = ";
	while(n>1){
		if(round(n/i) == n/i){
			if(n != _n){
				cout << "*";
			}
			n/=i;
			cout << to_string(i);
		}else{
			i = i+1;
			while(!isPrime(i)){
				i = i+1;
			}
		}
	}
	cout << endl << "Done" << endl;
}
int main(int argc, char const *argv[])
{
	cout << "Ready" << endl;
	while(true){
		fac();
	}
	return 0;
}