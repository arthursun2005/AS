#include <iostream>
#include <cmath>
using namespace std;
long long hcf(long a, long b){
	if(a == 0){
		return b;
	}else if(b == 0){
		return a;
	}else{
		return hcf(b, a%b);
	}
}
long long lcm(long a, long b){
	return a*b/hcf(a, b);
}
int main(int argc, char const *argv[])
{
	cout << "ready" << endl;
	while(true){
		long a, b;
		cin >> a;
		cin >> b;
		cout << "lcm: " << lcm(a, b) << ", hcf: " << hcf(a, b) << endl;
	}
	return 0;
}