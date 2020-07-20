---
title: 13. 스프링 코어 - 인트로덕션을 이용해 POJO에 기능 더하기
issueNumber: '37'
createAt: 2020-07-08 22:41
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 13
---

## 1. 인트로덕션 알아보기

자바에선 어떤 공통 로직을 공유하는 클래스가 있을 경우, 해당 공통 클래스를 상속하거나 같은 인터페이스를 구현하는 형태로 애플리케이션을 개발한다. AOP 관점에서는 충분히 모듈화 가능한 공통 관심사임에도 자바는 다중 상속이 되지 않기 때문에 동시에 여러 구현 클래스로부터 기능을 물려 받아 쓰는 것이 불가능하다. 예를 들어 다음과 같은 인터페이스와 구현체들이 있다고 하자.

```java{numberLines: true}
public interface InterfaceA {
	void a();
}

@Component
public class InterfaceAImpl implements InterfaceA{
	@Override
	public void a() {
		System.out.println("a 실행");
	}
}
```

```java{numberLines: true}
public interface InterfaceB {
	void b();
}

@Component
public class InterfaceBImpl implements InterfaceB {
	@Override
	public void b() {
		System.out.println("b 실행");
	}
}
```

```java{numberLines: true}
public interface InterfaceC {
	void c();
}

@Component
public class InterfaceCImpl implements InterfaceC {
	@Override
	public void c() {
		System.out.println("c 실행");
	}
}
```

이렇게 각각 인터페이스와 구현체들을 사용하다가 만약 InterfaceAImpl에서 InterfaceBImpl의 b() 메서드와 InterfaceCImpl의 c() 메서드를 사용해야 되는 상황이라고 가정해보자. 자바는 다중 상속이 불가능하기 때문에 InterfaceAImpl이 interfaceBImpl를 상속하고 InterfaceC를 구현하여 c() 메서드를 똑같이 복사해야할 것이다. 아래와 같이 말이다. 결국 똑같은 기능을 하는 c() 메서드는 중복되었다.

```java{numberLines: true}
@Component
public class InterfaceAImpl extends InterfaceBImpl implements InterfaceA, InterfaceC{
	@Override
	public void a() {
		System.out.println("a 실행");
	}

	@Override
	public void c() {
		System.out.println("c 실행");
	}
}
```

AOP 어드바이스의 특별한 타입인 인트로덕션을 사용하면 이러한 중복을 피할 수 있다. 인트로덕션은 객체가 어떤 인터페이스의 구현 클래스를 공급받아 동적으로 인터페이스를 구현하는 기술이다. 마치 객체가 런타임에 구현 클래스를 상속하는 것처럼 보이게 한다. 인트로덕션은 아래와 같이 애스펙트 안에서 필드에 @DeclareParents를 붙여 선언한다.

```java{numberLines: true}
@Aspect
@Component
public class Introduction {

	@DeclareParents(
		value = "my.spring.demo.InterfaceAImpl",
		defaultImpl = InterfaceBImpl.class
	)
	public InterfaceB interfaceB;

	@DeclareParents(
		value = "my.spring.demo.InterfaceAImpl",
		defaultImpl = InterfaceCImpl.class
	)
	public InterfaceC interfaceC;
}
```

인트로덕션 대상 클래스는 value 속성으로 지정하고 이 어노테이션을 붙인 필드형에 따라 들여올 인터페이스가 결정된다. 그리고 이 들여온 인터페이스에서 사용할 구현 클래스는 defaultImpl 속성에 명시한다. 그럼 놀랍게도 아래와 같은 코드가 정상 실행된다.

```java{numberLines: true}
public class App {
  public static void main(String[] args) {
      ApplicationContext context = new AnnotationConfigApplicationContext(AppConfiguration.class);

      InterfaceA implA = context.getBean("interfaceAImpl", InterfaceA.class);
      implA.a();

      InterfaceB implB = (InterfaceB) implA;
      implB.b();

      InterfaceC implC = (InterfaceC) implA;
      implC.c();
  }
}
```

```shell
a 실행
b 실행
c 실행
```

## 2. 인트로덕션 활용해보기

AOP 인트로덕션을 활용하면 기존 POJO를 수정하지 않고도 공통적인 기능을 더할 수 있다. 예를 들어 기존 POJO들이 얼마나 호출 되었는지 카운팅 한다고 가정해보자. 카운팅을 하기 위해 기존 POJO에 상태값을 추가하거나 기존 POJO들이 하나의 베이스 클래스를 상속하는 것은 좋지 못하다. 위의 예제에서 InterfaceAImpl, InterfaceBImpl, InterfaceCImpl의 모든 메서드 호출시 카운트를 증가시키는 기능을 인트로덕션을 통해 구현하면 다음과 같다.

```java{numberLines: true}
public interface Counter {
	void increase();
	int getCount();
}

public class CounterImpl implements Counter{

	private int count;

	@Override
	public void increase() {
		count++;
	}

	@Override
	public int getCount() {
		return count;
	}
}
```

위와 같이 간단한 카운터 인터페이스와 구현 클래스를 만들었다. 그리고 아래와 같이 애스펙트를 설정한다. my.spring.demo 패키지와 하위 패키지들 중 이름이 Impl로 끝나는 클래스들이 대상이 되고 끌어들일 인터페이스는 Counter다. 그리고 my.spring.demo 패키지와 하위 패키지들 중 이름이 Interface로 시작하는 인터페이스를 구현한 클래스의 모든 메서드 호출 후 카운트를 증가시키는 어드바이스를 선언한다.

```java{numberLines: true}
@Aspect
@Component
public class Introduction {

	@DeclareParents(
		value = "my.spring.demo..*Impl",
		defaultImpl = CounterImpl.class
	)
	public Counter counter;

	@After("execution(* my.spring.demo..Interface*.*(..)) && this(counter)")
	public void increaseCount(Counter counter) {
		counter.increase();
	}
}
```

그리고 아래와 같이 코드를 작성하고 실행하면 정삭적으로 카운트가 증가되는 것을 볼 수 있다.

```java{numberLines: true}
public class App {
  public static void main(String[] args) {
      ApplicationContext context = new AnnotationConfigApplicationContext(AppConfiguration.class);

      InterfaceA implA = context.getBean("interfaceAImpl", InterfaceA.class);
      Counter implACounter = (Counter) implA;

      implA.a();
      implA.a();
      System.out.println("implA 호출 횟수: " + implACounter.getCount());

      InterfaceB implB = context.getBean("interfaceBImpl", InterfaceB.class);
      Counter implBCounter = (Counter) implB;

      implB.b();
      implB.b();
      implB.b();
      System.out.println("implB 호출 횟수: " + implBCounter.getCount());
  }
}
```

```shell
a 실행
a 실행
implA 호출 횟수: 2
b 실행
b 실행
b 실행
implB 호출 횟수: 3
```

여기까지 AOP 인트로덕션과 사용법에 대해 알아보았다.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
