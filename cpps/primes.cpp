#include <iostream>
#include <cmath>
using namespace std;
int isPrime(long long n){
	double t = n;
	for(double i=2;i<=sqrt(t);++i){
		if(round(t/i) == t/i){
			return false;
		}
	}
	return true;
}
int main(int argc, char const *argv[])
{
	cout << "Ready" << endl;
	while(true){
		double ni;
		if(!(cin >> ni)){
			cout << "Enter a integer only" << endl;
			cin.clear();
      		cin.ignore(1000,'\n');
      		ni = 2;
		}
		long long n = ni;
		cout << n << endl;
		for (unsigned int i = 0; i < 1e3; ++i)
		{
			n = n+1;
			while(!isPrime(n)){
				n++;
			}
			cout << n << endl;
			if(i == ni-1){cout << "Ready" << endl;}
		}
	}
	return 0;
}