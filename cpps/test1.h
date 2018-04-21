#ifndef test1_h
#include <iostream>
#include <cmath>
#define test1_h

#ifndef PI
#define PI 3.1415926536
#endif

#ifndef E
#define E 2.718281828459
#endif

using namespace std;
struct Vec2
{
public:
	Vec2(double _x = 0, double _y = 0){
		this->set(_x, _y);
	}
	~Vec2(){}
	string toString(){
		return "("+to_string(x)+", "+to_string(y)+")";
	}
	void set(double _x = 0, double _y = 0){
		this->x = _x, this->y = _y;
	}
	inline double angle(){
		double a = atan2(y, x);
		if(a<0){a+=2*PI;}
		return a;
	}
	inline double dot(Vec2 v){
		return this->x * v.x + this->y * v.y;
	}
	inline double mag(){
		return sqrtf(x*x + y*x);
	}
	inline bool operator == (Vec2 &v){
		return this->x == v.x && this->y == v.y;
	};
	inline Vec2 operator + (Vec2 &c){
		return Vec2(this->x + c.x, this->y + c.y);
	};
	inline Vec2 operator - (Vec2 &c){
		return Vec2(this->x - c.x, this->y - c.y);
	};
	inline void operator += (Vec2 &c){
		this->x += c.x;
		this->y += c.y;
	};
	inline void operator -= (Vec2 &c){
		this->x -= c.x;
		this->y -= c.y;
	};
	double x, y;
};
#endif