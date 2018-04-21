#include <iostream>
using namespace std;
#include "test1.h"
#include "Complex.h"
int main(int argc, char const *argv[])
{
	Vec2 v1(20,40);
	Vec2 v2(60,20);
	Vec2 v3 = v1 + v2;
	Vec2 *v4 = new Vec2(20,30);
	cout << v3.toString() << endl;
	cout << v4->toString() << endl;
	printf("123\n");
	return 0;
}