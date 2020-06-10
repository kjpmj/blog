---
title: 02. 스프링 코어
issueNumber: '24'
createAt: 2020-05-11 21:53
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 01
---

## 1. IoC 컨테이너

앞의 글에서 스프링의 핵심은 POJO라고 했다. 스프링에선 이러한 POJO 인스턴스를 new 연산자로 만드는 것이 아니라 **IoC컨테이너**가 POJO를 구성하고 관리한다.
IoC컨테이너란 `제어의 역전(Inversion of Control)과 컨테이너를 합친 말이다`. 일단 **컨테이너(Container)**라고 하면 보통 직사각형의 화물 수송용 컨테이너같은 무엇인가를 담는 용기 또는 그릇을 뜻한다. 그와 비슷하게 프로그래밍 세계에선 보통 인스턴스를 담고 인스턴스의 생명주기 관리와 추가적인 기능을 제공하는 것을 컨테이너라고 한다. **제어의 역전**이란 기존의 개발자가 주도적으로 갖고 있던 프로그램의 제어 흐름을 역전시키는 것을 의미한다. 그래서 두 단어를 합쳐보면 기존의 방식처럼`객체의 생명주기와 제어를 개발자가 담당하는 것이 아니고, 컨테이너가 담당하는 것이 IoC컨테이너의 뜻인 것 같다.` 대충 IoC컨테이너가 어떤 의미인지 알아봤으니 예제를 통해서 더 알아보자. 일단 그전에 IoC컨테이너가 없는 기존 방식과 **DIP(Dependency Inversion Principle)**에 대해 알아보면 왜 IoC컨테이너를 사용하는게 좋은 지 쉽게 알 수 있을 것 같다.

## 2.의존성 역전 원칙

DIP(의존성 역전 원칙)는 SOLID원칙 중 D를 담당하는 원칙이고 다음과 같이 정리할 수 있다.

> - 상위(고차원) 모듈이 하위(저차원)모듈에 의존해서는 안된다. 상위 모듈과 하위 모듈 모두 추상화에 의존해야 한다.
> - 추상적인 것은 구체적인 것에 의존해서는 안된다. 구체적인 것이 추상적인 것에 의존해야 한다.

예를 들어 아래와 같은 코드가 있다고 하자. 자동차 객체는 엔진과 타이어같은 객체를 조립하여 만드는데, 소나타라는 이름을 가진 자동차 객체를 만들기 위해 금호타이어 객체가 필요한 상황이다. 이렬 경우 자동차 객체가 금호타이어 객체에 의존한다. 고로 상위 모듈이 하위 모듈에 의존하고 있다.

<!-- <div style="width: 15%; height: 15%; margin: 0 auto;"> -->

<img src="../../src/images/Spring02-01.png" ></img>

<!-- </div> -->
<br/>

처음 자동차 클래스를 구상할 땐 여러가지 부품을 조립하여 여러 종류의 자동차를 만드는 재사용 가능한 클래스로 구상하였다. 그래서 자동차 클래스로 소나타말고 K5를 만든다고 하자. 그런데 K5는 금호 타이어 객체가 아닌 한국 타이어 객체를 사용해야 하는 상황이라면 어떻게 해야할까? 아마도 자동차 클래스의 금호타이어와 관련된 부분을 모두 한국타이어로 수정해야 할 것이다. `결국 자동차 클래스는 재사용이 불가능한 클래스가 되버렸다.`

<!-- <div style="width: 50%; height: 50%; margin: 0 auto;"> -->

<img src="../../src/images/Spring02-02.png" ></img>

<!-- </div> -->
<br/>

문제점이 무엇인지 알았으니 해결해보자. 일단 자동차 클래스를 재사용 가능한 클래스로 만들기 위한 첫 걸음은 DIP를 준수 하는 것이다. 자바에선 인터페이스를 통해 아래 그림과 같이 DIP를 준수할 수 있다. 자동차 객체는 타이어 인터페이스( _추상적인 것_ )에 의존하고 타이어 인터페이스를 구현한 금호타이어와 한국타이어( _구체적인 것_ )는 다시 타이어 인터페이스에 의존한다.

<img src="../../src/images/Spring02-03.png" ></img>
<br/>

여기까지의 과정을 코드로 살펴보자. 다음과 같이 **KumhoTire**, **HankookTire**, **Car** 클래스가 있다.

```java{numberLines: true}
public class KumhoTire {
	public String getName() {
		return "금호타이어";
	}
}
```

```java{numberLines: true}
public class HankookTire {
	public String getName() {
		return "한국타이어";
	}
}
```

```java{numberLines: true}
public class Car {
	private String name;
	private KumhoTire tire;

	public Car(String name, KumhoTire tire) {
		this.name = name;
		this.tire = tire;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public KumhoTire getTire() {
		return tire;
	}
	public void setTire(KumhoTire tire) {
		this.tire = tire;
	}

	public String getCarInfo() {
		StringBuilder builder = new StringBuilder();

		builder.append("차 이름: " )
			.append(this.getName())
			.append("  타이어 종류: ")
			.append(this.getTire().getName());

		return builder.toString();
	}
}
```

현재 자동차가 금호타이어에 의존하고 있다.

```java{numberLines: true}
public static void main(String[] args) {
  KumhoTire tire = new KumhoTire();
  Car car = new Car("소나타", tire);

  System.out.println(car.getCarInfo());
}
```

```shell
차 이름: 소나타  타이어 종류: 금호타이어
```

이제 한국타이어를 사용하여 K5를 만들어 보자

```java{numberLines: true}
public class Car {
	private String name;
	private HankookTire tire;

	public Car(String name, HankookTire tire) {
		this.name = name;
		this.tire = tire;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public HankookTire getTire() {
		return tire;
	}
	public void setTire(HankookTire tire) {
		this.tire = tire;
	}

	public String getCarInfo() {
		StringBuilder builder = new StringBuilder();

		builder.append("차 이름: " )
			.append(this.getName())
			.append("  타이어 종류: ")
			.append(this.getTire().getName());

		return builder.toString();
	}
}
```

```java{numberLines: true}
public static void main(String[] args) {
	HankookTire tire = new HankookTire();
	Car car = new Car("K5", tire);

	System.out.println(car.getCarInfo());
}
```

```shell
차 이름: K5  타이어 종류: 한국타이어
```

소스코드의 많은 부분을 수정했다. 현재 Car 클래스는 재활용이 불가능하다. 그럼 이제 인터페이스를 사용하여 타이어들을 추상화 시켜보자.

```java{numberLines: true}
public interface Tire {
	String getName();
}
```

```java{numberLines: true}
public class KumhoTire implements Tire{
	@Override
	public String getName() {
		return "금호타이어";
	}
}

```

```java{numberLines: true}
public class HankookTire implements Tire{
	@Override
	public String getName() {
		return "한국타이어";
	}
}
```

```java{numberLines: true}
public class Car {
	private String name;
	private Tire tire;

	public Car(String name, Tire tire) {
		this.name = name;
		this.tire = tire;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Tire getTire() {
		return tire;
	}
	public void setTire(Tire tire) {
		this.tire = tire;
	}

	public String getCarInfo() {
		StringBuilder builder = new StringBuilder();

		builder.append("차 이름: " )
			.append(this.getName())
			.append("  타이어 종류: ")
			.append(this.getTire().getName());

		return builder.toString();
	}
}
```

```java{numberLines: true}
public static void main(String[] args) {
	Tire tire = new KumhoTire();
	Car car = new Car("소나타", tire);

	System.out.println(car.getCarInfo());
}
```

```shell
차 이름: 소나타  타이어 종류: 금호타이어
```

이제 Car 클래스는 Tire 인터페이스를 구현하는 객체들로 조립할 수 있게 됬다. 그래서 소나타를 생산할 때 갑자기 회사 정책이 바뀌어 한국타이어를 써야한다면 아래 코드와 같이 Car 클래스를 수정 하지 않고 Tire만 교체하면 된다.

```java{numberLines: true}
public static void main(String[] args) {
	Tire tire = new HankookTire();
	Car car = new Car("소나타", tire);

	System.out.println(car.getCarInfo());
}
```

```shell
차 이름: 소나타  타이어 종류: 한국타이어
```

그런데 약간 아쉬운 부분이 있다. Tire를 교체하기 위해 약간의 코드 수정이 불가피하기 때문이다. 자바 코드를 수정하게 되면 결국 다시 빌드해서 배포해야 하는 번거로움이 발생한다. 이 부분을 해결하기 위해 Spring이 제공하는 IoC컨테이너를 생성하고 IoC컨테이너가 Car, KumhoTire, HankookTire 객체를 생성하고 관리하게 해보자. IoC컨테이너가 관리하는 객체를 **Bean**이라고 하는데 Bean을 등록하기 위해서는 적절한 메타정보를 만들어 IoC컨테이너에게 제공해야 한다. **XML, 어노테이션, 자바코드등**으로 메타정보로 만들어서 IoC컨테이너에게 제공하면 IoC컨테이너는 메타정보를 통해 인스턴스를 생성하고 **의존성 주입(DI)** 작업을 수행한다. 그러면 개발자는 해당 인스턴스를 불러와서 사용하기만 하면 된다. 일단 예제에선 XML파일로 Bean을 등록하여 사용해보겠다. 다음 글부턴 자바코드, 어노테이션을 사용해서 Bean을 등록하는 법부터 차근차근 작성할 예정이다.

```xml
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-3.2.xsd">

    <context:annotation-config />


    <bean id="car" class="my.spring.demo.Car">
    	<constructor-arg index="0" value="소나타"></constructor-arg>
    	<property name="tire" ref="hankookTire"></property>
    </bean>
    <bean id="kumhoTire" class="my.spring.demo.KumhoTire"></bean>
    <bean id="hankookTire" class="my.spring.demo.HankookTire"></bean>
</beans>
```

일단 IoC컨테이너를 만들기 위한 XML을 작성하고 Car, KumhoTire, HankookTire를 Bean으로 등록했다. 그리고 Car 인스턴스를 생성할 때, 기본 생성자가 아닌 파라미터를 받는 생성자를 사용하게 했다. 또한 tire 필드에는 HankookTire를 주입하였다. 이렇게 하고 IoC컨테이너를 생성하게 되면 IoC컨테이너가 생성되는 순간에 Bean으로 등록한 클래스들의 생성자를 호출하여 인스턴스를 미리 만들어 놓는다.

```java{numberLines: true}
@Component
public class KumhoTire implements Tire{
	public KumhoTire() {
		System.out.println("금호타이어 생성");
	}

	@Override
	public String getName() {
		return "금호타이어";
	}
}
```

```java{numberLines: true}
@Component
public class HankookTire implements Tire{
	public HankookTire() {
		System.out.println("한국타이어 생성");
	}

	@Override
	public String getName() {
		return "한국타이어";
	}
}
```

```java{numberLines: true}
@Component
public class Car {
	private String name;

	private Tire tire;

	public Car() {
		System.out.println("기본 Car 생성자");
	}

	public Car(String name) {
		this.name = name;
		System.out.println("Car 네임 생성자: " + name);
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Tire getTire() {
		return tire;
	}
	public void setTire(Tire tire) {
		this.tire = tire;
	}

	public String getCarInfo() {
		StringBuilder builder = new StringBuilder();

		builder.append("차 이름: " )
			.append(this.getName())
			.append("  타이어 종류: ")
			.append(this.getTire().getName());

		return builder.toString();
	}
}
```

이렇게 생성자를 호출할 때 System.out.println으로 확인을 해보자. 아래 코드는 IoC컨테이너를 생성만 하는 코드이다.

```java{numberLines: true}
public class App {
    public static void main(String[] args) {
    	ApplicationContext context = new GenericXmlApplicationContext("appContext.xml");
    }
}

```

결과는 아래와 같다. IoC컨테이너를 생성하는 순간에 Bean으로 등록한 인스턴스들이 생성되는 것을 확인할 수 있다.

```shell
Car 네임 생성자: 소나타
한국타이어 생성
금호타이어 생성
```

개발자는 이렇게 생성된 IoC컨테이너에서 필요한 객체만 불러와서 사용하면 된다.

```java{numberLines: true}
public class App {
    public static void main(String[] args) {
    	ApplicationContext context = new GenericXmlApplicationContext("appContext.xml");
    	Car car = context.getBean(Car.class);
    	System.out.println(car.getCarInfo());
    }
}
```

```shell
Car 네임 생성자: 소나타
한국타이어 생성
금호타이어 생성
차 이름: 소나타  타이어 종류: 한국타이어
```

**만약 타이어를 금호타이어로 바꾸고 싶다면 Xml에서 tire필드의 ref를 kumhoTire로 수정하면 된다!!!**

## 3. 결론

이렇게 의존성 역전 원칙을 준수하고 IoC컨테이너를 활용하여 개발을 하게되면 자바 코드를 수정하고 다시 빌드하고 배포하는 과정을 생략할 수 있다. 고객의 요구가 수시로 변하는 엔터프라이즈 애플리케이션 개발에 있어서 정말 필요한 기술인 것 같다. **그런데 2년 넘게 개발을 하면서 하나의 Interface를 구현하는 구현체들을 여러개 만들어 본 적이 없는 것 같다...** 뭔가 수정해야하는 부분이 있다면 기존의 구현체를 수정하는 쪽으로 개발하였다. 이제부터는 IoC 컨테이너를 활용하여 개발하는 쪽으로 생각을 해봐야 하지 않을까 싶다. 다음 글부턴 스프링의 제공하는 IoC컨테이너의 종류와 IoC컨테이너를 본격적으로 활용하는 법을 작성하겠다.

<br/><br/><br/><br/><br/>
