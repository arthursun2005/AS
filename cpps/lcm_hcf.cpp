#include <iostream>
#include <cmath>
using namespace std;
int hcf(int a, int b){
	if(a == 0){
		return b;
	}else if(b == 0){
		return a;
	}else{
		return hcf(b, a%b);
	}
}
int lcm(int a, int b){
	return a*b/hcf(a, b);
}
int main(int argc, char const *argv[])
{
	cout << "ready" << endl;
	while(true){
		int a, b;
		cin >> a;
		cin >> b;
		cout << "lcm: " << lcm(a, b) << ", hcf: " << hcf(a, b) << endl;
	}
	return 0;
}