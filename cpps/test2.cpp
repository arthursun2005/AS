#include <iostream>
#include "Primes.h"
using namespace std;
int main(int argc, char const *argv[])
{
	init();
	for (unsigned long i = 0; i < LENGTH; ++i)
	{
		//cout << _primes[i] << endl;
		cout << changeToBinary(_primes[i]) << endl << endl;
	}
	return 0;
}