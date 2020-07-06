---
title: 11. 스프링 코어 - AOP 자세히 알아보기 1
issueNumber: '35'
createAt: 2020-06-25 23:03
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 11
---

## 1. 조인포인트 정보 가져오기

이전 글의 예제를 보면 어드바이스 메서드에서 `org.aspectj.lang.JoinPoint` 타입의 파라미터를 받는 부분이 있었다. 이것으로 조인포인트 정보를 얻을 수 있다. 다음은 이전 글의 play 조인포인트의 정보를 가져와서 출력하는 예제이다.

```java{numberLines: true}
@Before("execution(* my.spring.demo..Musician.play())")
public void introduceMusician(JoinPoint joinPoint) {
	System.out.println("Join Point kind: " + joinPoint.getKind());
	System.out.println("Signature declaring type: " + joinPoint.getSignature().getDeclaringTypeName());
	System.out.println("Signature name: " + joinPoint.getSignature().getName());
	System.out.println("Arguments: " + Arrays.toString(joinPoint.getArgs()));
	System.out.println("Target class: " + joinPoint.getTarget().getClass().getName());
	System.out.println("This class: " + joinPoint.getThis().getClass().getName());
}
```

```shell
Join Point kind: method-execution
Signature declaring type: my.spring.demo.concert.Musician
Signature name: play
Arguments: []
Target class: my.spring.demo.concert.Guitarist
This class: com.sun.proxy.$Proxy21
```

프록시로 감싼 타겟 객체는 getTarget()으로, 프록시 객체는 getThis()로 가져올 수 있다.

## 2. @Order로 애스펙트 우선순위 설정하기

만약 하나의 조인포인트에 여러개의 어드바이스를 지정할 경우 순서를 정해야 한다. 각 애스펙트 클래스가 Ordered 인터페이스를 구현하거나, @Order 어노테이션을 붙이면 되는데 둘 다 작은 값일 수록 우선순위가 높아진다. 다음은 @Order를 이용하여 무엇이 먼저 적용되는지 출력한 예제이다.

```java{numberLines: true}
@Aspect
@Component
@Order(1)
public class ConcertAspect {

	@Before("execution(* my.spring.demo..Musician.play())")
	public void introduceMusician(JoinPoint joinPoint) {
		System.out.println("첫번째 Before");
	}

	@After("execution(* my.spring.demo..Musician.play())")
	public void applauseAfterPlay() {
		System.out.println("첫번째 After");
	}
}

```

```java{numberLines: true}
@Aspect
@Component
@Order(2)
public class ConcertAspect2 {

	@Before("execution(* my.spring.demo..Musician.play())")
	public void introduceMusician(JoinPoint joinPoint) {
		System.out.println("두번째 Before");
	}

	@After("execution(* my.spring.demo..Musician.play())")
	public void applauseAfterPlay() {
		System.out.println("두번째 After");
	}
}
```

```shell
첫번째 Before
두번째 Before
두번째 After
첫번째 After
```

결과에서 알 수 있듯 @Before는 우선순위가 높은 것이 먼저 실행되고, @After는 우선순위가 높은 것이 나중에 실행된다.

## 3. 포인트컷 재사용하기

위의 예제를 보면 포인트컷이 모두 동일하다. 이럴 경우 **@Pointcut**을 이용하여 포인트컷을 따로 정의하고 여러 어드바이스에 재사용할 수 있다. 메서드에 @Pointcut을 붙이고 메서드 바디는 보통 비워둔다.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@Pointcut("execution(* my.spring.demo..Musician.play())")
	private void MusiciaPlayPointcut() {}

	@Before("MusiciaPlayPointcut()")
	public void introduceMusician(JoinPoint joinPoint) {
		...
	}

	@After("MusiciaPlayPointcut()")
	public void applauseAfterPlay() {
		...
	}
}
```

여러 애스펙트가 포인트컷을 공유하는 경우라면 공통 클래스 한 곳에 포인트컷을 모아두는 편이 좋다. 이때는 당연히 포인트컷 메서드는 public으로 선언해야 한다. 이때 해당 포인트컷을 참조하려면 클래스명도 같이 적어주어야 한다. 만약 패키지가 다를 경우 패키지명도 적는다.

```java{numberLines: true}
@Aspect
public class ConcertPointcut {

	@Pointcut("execution(* my.spring.demo..Musician.play())")
	public void MusiciaPlayPointcut() {}
}
```

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect2 {

	@Before("ConcertPointcut.MusiciaPlayPointcut()")
	public void introduceMusician(JoinPoint joinPoint) {
		System.out.println("두번째 Before");
	}

	@After("my.spring.demo.aop.ConcertPointcut.MusiciaPlayPointcut()")
	public void applauseAfterPlay() {
		System.out.println("두번째 After");
	}
}
```

여기까지 AOP에 대해 조금 더 알아보았다. 다음 글에선 AspectJ 포인트컷 표현식에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
