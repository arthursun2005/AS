#include <iostream>
#include <cmath>
using namespace std;
int main(int argc, char const *argv[])
{
	cout << "Ready" << endl;
	unsigned int c = 1000;
	long double a = 0;
	for (double i = 1; i <= c; ++i){
		a += 1/(i*i);
	}
	cout << to_string(a) << endl;
	return 0;
}