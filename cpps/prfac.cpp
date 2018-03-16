#include <iostream>
#include <cmath>
using namespace std;
double isPrime(double n){
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
	}
	n = abs(n);
	double i = 2;
	while(n>1){
		if(round(n/i) == n/i){
			n/=i;
			cout << to_string(i) << endl;
		}else{
			i = i+1;
			while(!isPrime(i)){
				i = i+1;
			}
		}
	}
}
int main(int argc, char const *argv[])
{
	cout << "ready" << endl;
	while(true){
		fac();
	}
	return 0;
}