#include <iostream>
#include <cmath>
using namespace std;
#define LENGTH 18
int _primes[LENGTH] = {2};
bool isPrime(double n){
	for(double i=2;i<=sqrtf(n);++i){if(floor(n/i) == n/i){return false;}}
	return true;
}
string changeToBinary(unsigned long long num){
	string r = "";
	while(num >= 1){
		r += to_string(num%2);
		num = floor(num/2);
	}
	reverse(r.begin(), r.end());
	return r;
}
void init(){
	unsigned long long start;
	for (int i = 0; i < LENGTH; ++i)
	{
		start = _primes[i]+1;
		while(!isPrime(start)){start++;}
		_primes[i+1] = start;
	}
}