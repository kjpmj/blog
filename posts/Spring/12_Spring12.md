---
title: 12. 스프링 코어 - AspectJ 포인트컷 표현식
issueNumber: '36'
createAt: 2020-07-06 21:25
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 12
---

포인트컷 표현식에 대해 알아보기 전에 **스프링 AOP가 지원하는 조인포인트 대상은 IoC 컨테이너 안에 선언된 빈에만 국한된다는 점을 유의하자.** 이 스코프를 벗어나 포인트컷 표현식을 사용하면 예외가 발생한다.

AOP의 글 시작 부터 계속 포인트컷에 대해 얘기하였고, 예제에선 `"execution(* my.spring.demo..Musician.play())"`으로 계속 사용하였는데 이제 이것이 무엇을 뜻하는지 알아보자.

## 1. 메서드 시그니처 패턴

포인트컷 표현식의 가장 일반적인 모습은 시그니처를 기준으로 여러 메서드를 매치하는 것이다. 다음은 Musician 인터페이스에 선언한 모든 메서드를 전부 매치시키는 표현식이다. 앞쪽의 와일드카드(\*)는 접근제한자와 반환형에 상관없이, 뒷쪽 두 점(..)은 인수 개수와 타입에 상관없이 매치시키겠다는 뜻이다.

```shell
execution(* my.spring.demo.concert.Musician.*(..))
```

대상 클래스나 인터페이스가 애스펙트와 같은 패키지에 있으면 패키지명은 안 써도 된다. 다음은 Musician 인터페이스에 선언된 모든 public 메서드에 매치시키는 표현식이다.

```shell
execution(public * my.spring.demo.concert.Musician.*(..))
```

특정 타입을 반환하는 조인포인트만 특정할 수 있다. 다음 표현식은 double형을 반환하는 메서드만 매치시킨다.

```shell
execution(public double my.spring.demo.concert.Musician.*(..))
```

인수 목록도 제약을 둘 수 있다. 다음 표현식은 첫 번째 인수가 double형인 메서드만 매치하고 (..)으로 두 번째 이후 인수는 몇 개라도 상관없음을 나타낸다.

```shell
execution(public double my.spring.demo.concert.Musician.*(double, ..))
```

아니면 인수 타입과 개수를 정확하게 매치시킬 수도 있다.

```shell
execution(public double my.spring.demo.concert.Musician.*(double, double))
```

이제 예제에서 계속 사용하던 표현식을 살펴보면 my.spring.demo 패키지와 그 하위의 Musician 인터페이스의 play() 메서드를 매치시킨다.

```shell
execution(* my.spring.demo..Musician.play())
```

참고로 다음은 모든 조인포인트를 매치시키는 표현식이다.

```shell
execution(* *.*(..))
```

이렇게 접근제한자, 반환형, 메서드명, 인수등의 공통 특징으로 매치시킬 수 있는데, 간혹 이러한 공통 특징이 없는 경우가 있을 수 있다. 이럴 때 메서드/타입(class, interface, enum) 레벨에 다음과 같은 커스텀 어노테이션을 만들어 붙이면 된다.

```java{numberLines: true}
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CustomAnnotaition {

}
```

```java{numberLines: true}
@Pointcut("@annotation(my.spring.demo.aop.CustomAnnotaition)")
public void customAnnotationPointcut() {}

@Before("customAnnotationPointcut()")
public void introduceMusician(JoinPoint joinPoint) {
	...
}
```

```java{numberLines: true}
@Component
@CustomAnnotaition
public class Guitarist implements Musician{

	@Override
	@CustomAnnotaition
	public void play() {
		...
	}
}
```

어노테이션은 상속되지 않으므로 인터페이스가 아닌 구현 클래스에 붙여야 한다. 위와 같이 클래스나 메서드에 붙일 수 있다. <b style="color: #e03131;">클래스 레벨에 붙이면 모든 메서드에 적용된다고 하는데 이 부분이 잘 안된다.</b>

## 2. 타입 시그니처 패턴

within 키워드로 특정한 타입 내부의 모든 조인포인트를 매치시킬 수 있다. 다음 표현식은 my.spring.demo.concert 패키지의 전체 메서드 실행 조인포인트를 매치시킨다.

```shell
within(my.spring.demo.concert.*)
```

만약 my.spring.demo.concert 패키지와 그 하위 패키지들을 매치시킬려면 다음과 같이 점을 하나 더 붙인다.

```shell
within(my.spring.demo.concert..*)
```

어느 한 클래스 내부에 구현된 메서드 실행 조인포인트를 매치시키려면 다음과 같이 쓴다.

```shell
within(my.spring.demo.concert.Drummer)
```

Musician 인터페이스를 구현한 모든 클래스의 메서드 실행 조인포인트를 매치시키려면 맨 뒤에 +기호를 쓴다.

```shell
within(my.spring.demo.concert.Musician+)
```

커스텀 어노테이션으로도 매치 가능하다.

```java{numberLines: true}
@Pointcut("@within(my.spring.demo.aop.CustomAnnotaition)")
public void customAnnotationPointcut() {}
```

커스텀 어노테이션을 클래스 레벨에 붙이면 되는데 메서드 레벨에 붙이면 안된다. 그렇다면 아마도 @annotation는 메서드 레벨에 붙이고 @within은 클래스 레벨에 붙여야 되나보다.

## 3. 포인트컷 표현식 조합하기

AspectJ 포인트컷 표현식은 &&(and), ||(or), !(not) 등의 연산자로 조합이 가능하다. 예를 들어 다음은 Musician 인터페이스 또는 Person 인터페이스를 구현한 클래스의 조인포인트를 매치시킨다. 참고로 애스펙트와 대상 인터페이스가 같은 패키지에 있으면 패키지명은 생략 가능하다.

```shell
within(Musician+) || within(Person+)
```

포인트컷 표현식이나 다른 포인트컷을 가리키는 래퍼런스 모두 이런 연산자로 묶을 수 있다.

```java{numberLines: true}
@Aspect
@Component
public class ConcertAspect {

	@Pointcut("@within(my.spring.demo.aop.CustomAnnotaition)")
	public void customAnnotationPointcut() {}

	@Pointcut("within(my.spring.demo.concert.Person+)")
	public void personPointcut() {}

	@Before("customAnnotationPointcut() || personPointcut()")
	public void introduceMusician(JoinPoint joinPoint) {
		System.out.println("첫번째 Before");
	}
}
```

## 4. 포인트컷 매개변수 선언하기

조인포인트의 정보는 어드바이스 메서드에서 org.aspectj.lang.JoinPoint형 인수를 사용해서 얻을 수 있다. 이외에도 몇 가지 특수한 포인트컷 표현식을 사용하면 선언적인 방법으로 조인포인트 정보를 얻을 수 있다. target()과 args()로 각각 현재 조인포인트의 대상 객체 및 인수값을 포착하여 포인트컷 매개변수로 빼낼 수 있다. 아래 예제를 보면 hello() 메서드에서 두 개의 String 인수를 받고 있다. 포인트컷 표현식으로 어드바이스 메서드에서 해당 인수의 정보를 알 수 있다.

```java{numberLines: true}
@Component
public class PersonImpl implements Person{
	@Override
	public void hello(String name, String bye) {
		System.out.println("안녕하세요 " + name + " " + bye);
	}
}
```

```java{numberLines: true}
@Before("within(my.spring.demo.concert.Person+) && target(target) && args(a, b)")
public void helloPerson1(Object target, String a, String b) {
	...
}
```

독립적인 포인트컷을 선언해서 사용할 경우 다음과 같이 사용하면 된다.

```java{numberLines: true}
@Pointcut("within(my.spring.demo.concert.Person+) && target(target) && args(a, b)")
public void personPointcut(Object target, String a, String b) {}

@Before("personPointcut(target, a, b)")
public void helloPerson2(Object target, String a, String b) {
	...
}
```

여기까지 AspectJ 포인트컷 표현식에 대해 알아보았다. 다음 글에선 인트로덕션을 이용해 POJO에 기능을 더하는 방법에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
