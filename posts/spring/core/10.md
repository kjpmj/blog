---
title: 10. 스프링 코어 - 어노테이션을 활용한 AOP
issueNumber: '34'
createAt: 2020-06-22 21:34
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 10
---

스프링 첫 글에서 AOP(Aspect Oriented Programming)에 대해 간략히 설명하였는데, 다시 한번 정의하자면 AOP란 `핵심기능과 부가기능을 분리`하는 기법이다. 스프링에선 AOP를 지원하기 위해 AspectJ라는 라이브러리를 빌려왔다. 하지만 AOP 런타임 자체는 순수 스프링 AOP이기 때문에 AspectJ 컴파일러나 위버와는 아무런 의존 관계가 없다. 이제 AOP를 활용하는 예제를 살펴볼텐데, 그전에 **AOP의 주요 개념**과 **Spring AOP의 특징**부터 알아보자.

## 1. AOP 주요 개념

- **Aspect**
  <br/>
  : 여러 타입과 객체에 공통 관심사(예: 로깅, 트랜잭션 관리)를 모듈화한 자바 클래스로서 AOP에서 말하는 애스팩트란 어디에서(포인트컷) 무엇을 할 것인지 (어드바이스)를 합쳐 놓은 개념

- **Target**
  <br/>
  : 핵심기능을 담고 있는 모듈로서 부가기능이 부여될 대상, 애스팩트가 적용될 대상

- **Advice**
  <br/>
  : 실질적으로 어떤 일을 해야할 지 정의한 것, 부가기능을 담은 자바 메서드

- **Join Point**
  <br/>
  : 어드바이스가 적용될 수 있는 위치, 부가기능이 끼어들 수 있는 지점, 타겟 객체가 구현한 인터페이스의 모든 메서드는 조인 포인트가 된다.

- **Pointcut**
  <br/>
  : 어드바이스가 적용될 타입 및 객체를 찾는 표현식, 어드바이스가 실행될 지점(Target)을 정하는 표현식

## 2. Spring AOP의 특징

- Spring은 기본적으로 인터페이스 기반의 JDK 동적 프록시를 생성하여 AOP를 적용한다. 인터페이스를 사용할 수 없거나 애플리케이션 설계상 사용하지 않을 땐 CGLIB이란 것으로 프록시를 만들 수 있다. 프록시는 타겟을 감싸는데 이는 런타임에 생성된다.

- 프록시가 호출을 가로채서 어드바이스의 부가기능을 수행하고 타겟의 핵심기능 로직을 수행하거나, 핵심기능 다음에 부가기능을 수행할 수 있다.

- Spring AOP는 메서드 조인 포인트만 지원한다. 타겟의 메서드가 호출되는 런타임 시점에만 어드바이스를 적용할 수 있다. 반면에 AspectJ는 객체의 생성, static 메서드 호출등 다양한 조인 포인트에 어드바이스를 적용할 수 있다.

## 3. 어노테이션으로 AOP 적용하기

스프링에선 AspectJ와 동일한 어노테이션으로 어노테이션 기반의 AOP를 구현할 수 있다. 위에서 살펴본 애스팩트(조인포인트 + 포인트컷)을 정의하려면 일단 자바 클래스에 **@Aspect**를 붙이고 메서드별로 적절한 어노테이션을 붙여 어드바이스로 만든다. 어드바이스 어노테이션은 **@Before, @After, @AfterReturning, @AfterThrowing, @Around** 5개 중 하나를 쓸 수 있다.

<br/>

### 3-1. @Before 활용하기

이제 예제를 통해 살펴보자. 다음과 같이 Musician 인터페이스를 구현한 Guitarist와 Drummer가 있고 play() 메서드를 호출하면 연주를 하는 상황인데, 연주를 하기전에 뮤지션을 소개하는 멘트를 넣었다.

```java{numberLines: true}
@Component
public class Guitarist implements Musician{

	@Override
	public void play() {
		System.out.println("연주 전에 뮤지션을 소개합니다.");

		System.out.println("기타 연주~");
	}
}

@Component
public class Drummer implements Musician{

	@Override
	public void play() {
		System.out.println("연주 전에 뮤지션을 소개합니다.");

		System.out.println("드럼 연주~");
	}
}
```

그런데 기타리스트와 드러머 말고도, 피아니스트나 다른 뮤지션이 더 있는 상황이라면 모든 play() 메서드에 "연주 전에 뮤지션을 소개합니다."를 넣어주어야 한다. 바로 이 부분이 부가기능에 해당한다. 그럼 이제 AOP로 부가기능을 핵심기능에서 분리해보자.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@Before("execution(* my.spring.demo..Musician.play())")
	public void introduceMusician(JoinPoint joinPoint) {
		System.out.println("연주 전에 뮤지션을 소개합니다.");
	}
}
```

위의 코드는 my.spring.demo 패키지와 그 하위의 패키지들 중에서 Musician의 play() 메서드를 호출하기 전에 실행되어야 할 어드바이스를 정의한 코드이다. 이와 같이 핵심기능을 호출하기 전에 수행해야할 부가기능은 @Before 를 통해 정의한다.

```java{numberLines: true}
@Configuration
@EnableAspectJAutoProxy
@ComponentScan
public class AppConfiguration {

}
```

그리고 자바 구성 클래스에 @EnableAspectJAutoProxy를 붙여 스프링이 애스팩트를 스캐닝하게 한다. 그리고 다음과 같이 Main 클래스에서 실행시켜 보자.

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext(AppConfiguration.class);

		Musician guitarist = context.getBean("guitarist", Musician.class);
		Musician drummer = context.getBean("drummer", Musician.class);

		guitarist.play();
		drummer.play();
	}
}
```

```shell
연주 전에 뮤지션을 소개합니다.
기타 연주~
연주 전에 뮤지션을 소개합니다.
드럼 연주~
```

위와 같이 연주 전에 멘트가 출력되는 걸 볼 수 있다.

<br/>

### 3-2. @After 활용하기

After 어드바이스는 조인포인트가 호출이 된 후에 실행되는 메서드인데 조인포인트가 정상 실행되든, 도중에 예외가 발생하든 상관없이 실행된다. @After를 활용하여 연주가 끝난 후에 박수를 치는 부가기능을 만들어 보자.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {
	@After("execution(* my.spring.demo..Musician.play())")
	public void applauseAfterPlay() {
		System.out.println("짝 짝 짝");
	}
}

```

<br/>

### 3-3. @AfterReturning 활용하기

@After는 조인포인트가 정상 실행되든, 도중에 예외가 발생하든 상관없이 실행되는데, @AfterReturning 어드바이스는 조인포인트가 값을 반환하는 경우에만 실행된다. AfterReturning 어드바이스로 조인포인트가 반환한 결과를 가져오려면 returning 속성으로 지정한 변수명을 어드바이스 메서드의 인수로 지정한다. 스프링 AOP는 런타임에 조인포인트의 반환값을 이 인수에 넣어 전달한다. 이때 포인트컷 표현식은 따로 지정해야 한다.

```java{numberLines: true}
@Component
public class Guitarist implements Musician{
	@Override
	public String play2() {
		System.out.println("기타 연주~");
		return "성공적";
	}
}

@Component
public class Drummer implements Musician{
	@Override
	public String play2() {
		System.out.println("드럼 연주~");
		return "아쉬움";
	}
}
```

위와 같이 연주 결과를 반환하는 조인포인트가 있다. 그리고 연주 후에 해당 연주 결과를 출력하는 어드바이스는 다음과 같이 지정할 수 있다.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@AfterReturning(
		pointcut = "execution(* my.spring.demo..Musician.play2())",
		returning = "result"
	)
	public void afterReturningPlay(JoinPoint joinPoint, Object result) {
		System.out.println(result.toString());
	}
}
```

```shell
기타 연주~
연주결과: 성공적
드럼 연주~
연주결과: 아쉬움
```

<br/>

### 3-4. @AfterThrowing 활용하기

AfterThrowing 어드바이스는 조인포인트 실행 도중 예외가 발생했을 때 실행된다. 어드바이스 작성은 AfterReturning과 비슷하게 하면 되는데, throwing 속성에 지정한 변수명을 자바의 모든 에러/예외 클래스의 상위 타입인 Throwable 인수로 지정하면 모든 에러/예외를 가져올 수 있다.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@AfterThrowing(
		pointcut = "execution(* my.spring.demo..Musician.play3())",
		throwing = "e"
	)
	public void afterThrowingPlay(JoinPoint joinPoint, Throwable e) {
		System.out.println("연주 실패 이유: " + e.getMessage());
	}
}
```

혹시 특정한 예외가 발생했을 때만 어드바이스를 실행하고 싶다면 Throwable 말고 특정 예외 타입을 지정하면 된다.

<br/>

### 3-5. @Around 활용하기

앞에서 살펴본 어드바이스 모두 Around 어드바이스로 조합할 수 있다. 심지어 원본 조인포인트를 언제 실행할지, 실행 자체를 할지 말지 여부까지도 제어할 수 있다.

```java{numberLines: true}
@Component
public class Guitarist implements Musician{

	@Override
	public String play4() throws Exception {
		System.out.println("기타 연주~");
		return "성공적";
	}
}

@Component
public class Drummer implements Musician{

	@Override
	public String play4() throws Exception {
		throw new Exception("드럼 스틱 날라감");
	}
}
```

위와 같이 기타 연주는 성공적이고, 드럼 연주는 실패한 상황이다. 그리고 Around 어드바이스로 연주 전에 "연주 전에 뮤지션을 소개합니다."라는 메시지를 출력하고 연주 후에는 연주 결과를 출력하고 혹시 연주 중에 실패를 한 경우면 실패 이유를 출력하는 기능을 정의하였다.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@Around("execution(* my.spring.demo..Musician.play4())")
	public Object aroundPlay(ProceedingJoinPoint joinPoint) throws Throwable{
		System.out.println("연주 전에 뮤지션을 소개합니다.");
		try {
			Object result = joinPoint.proceed();
			System.out.println("연주결과: " + result.toString());
			return result;
		} catch (Exception e) {
			System.out.println("연주 실패 이유: " + e.getMessage());
			throw e;
		}
	}
}
```

9번째 줄에 `joinPoint.proceed();` 이 부분이 핵심기능을 담은 조인포인트를 실행하는 부분이다. 이것을 실행하기 전에 하는 기능은 @Before에 해당하고 이것 다음에 하는 기능은 @After에 해당한다.

여기까지 어노테이션을 활용한 스프링 AOP에 대해 알아보았다. 실제 개발에서는 만능 기능을 하는 Around 보다는 최소한의 요건을 충족하면서도 가장 기능이 약한 어드바이스를 사용하는 것이 바람직해보인다. 다음 글에선 지금까지 살펴본 AOP에 대해 좀 더 자세히 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
