#ifndef Complex_h
#include <iostream>
#include <cmath>
#define Complex_h

#ifndef PI
#define PI 3.1415926536
#endif

#ifndef E
#define E 2.718281828459
#endif

using namespace std;
struct Complex
{
public:
	Complex(double re = 0, double im = 0){
		this->set(re, im);
	}
	~Complex(){}
	void set(double re = 0, double im = 0){
		this->re = re;
		this->im = im;
	}
	double mag(){
		return sqrt(pow(re, 2) + pow(im, 2));
	}
	double angle(){
		return atan2(im, re);
	}
	inline Complex scl(double value){
		return Complex(re*value, im*value);
	}
	inline void scale(double value){
		re*=value, im*=value;
	}
	Complex operator*(Complex &c){
		Complex r;
		r.re = (this->re * c.re) - (this->im * c.im);
		r.im = (this->re * c.im) + (this->im * c.re);
		return r;
	};
	Complex operator/(Complex &c){
		Complex _c = this->clone();
		Complex c_inv = c.inv();
		Complex r = _c * c_inv;
		return r;
	};
	inline bool operator==(Complex &v){
		return this->re == v.re && this->im == v.im;
	};
	inline Complex operator+(Complex &c){
		return Complex(this->re + c.re, this->im + c.im);
	};
	inline Complex operator-(Complex &c){
		return Complex(this->re - c.re, this->im - c.im);
	};
	inline void operator+=(Complex &c){
		this->re += c.re;
		this->im += c.im;
	};
	inline void operator-=(Complex &c){
		this->re -= c.re;
		this->im -= c.im;
	};
	Complex inv(){
		Complex conj = this->conj();
		Complex c = this->clone();
		double r = (c * conj).re;
		return conj.scl(1/r);
	}
	Complex conj(){
		return Complex(re, -im);
	}
	Complex clone(){
		return Complex(re, im);
	}
	void setPolar(double r, double a){
		this->re = cos(a)*r;
		this->im = sin(a)*r;
	}
	double re, im;
};
#endif