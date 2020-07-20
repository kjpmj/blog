---
title: 07. 스프링 코어 - POJO 초기화 / 폐기
issueNumber: '31'
createAt: 2020-06-15 22:13
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 07
---

앞의 글에서 @PostConstruct를 사용해서 빈 인스턴스가 초기화 될 때 수행할 메서드를 지정하였다. 이것처럼 어떤 POJO는 빈이 생성되는 시점에 필요한 초기화 메서드나 빈이 소멸할때 실행해야하는 폐기 메서드가 필요하다.

## 1. initMethod와 destroyMethod

```java{numberLines: true}
public class User {

	// 초기화 메서드
	public void initUser() {
		System.out.println("유저 초기화");
	}

	public void printUser() {
		System.out.println("사용자 정보 출력~");
	}

	// 폐기 메서드
	public void destroyUser() {
		System.out.println("유저 폐기");
	}
}
```

위의 User 클래스에는 빈 인스턴스 초기화/폐기 시 실행해야할 메서드가 있다. 아래와 같이 자바 구성 클래스의 @Bean 정의부에 initMethod, destroyMethod 속성으로 각각 설정하면 빈 인스턴스가 생성/소멸될 때 해당 메서드가 실행된다.

```java{numberLines: true}
@Configuration
public class AppConfiguration {

	@Bean(initMethod = "initUser", destroyMethod = "destroyUser")
	public User user() {
		User user = new User();
		return user;
	}
}
```

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext(AppConfiguration.class);

		User user = context.getBean(User.class);
		user.printUser();

		((AnnotationConfigApplicationContext) context).close();
	}
}
```

```shell
유저 초기화
사용자 정보 출력~
유저 폐기
```

## 2. @PostConstruct와 @PreDestroy

@Bean 정의부 속성에 설정하는 방법 말고도 POJO에 각각 @PostConstruct 및 @PreDestroy를 붙여도 똑같이 동작한다.

```java{numberLines: true}
@Component
public class User {

	// 초기화 메서드
	@PostConstruct
	public void initUser() {
		System.out.println("유저 초기화");
	}

	public void printUser() {
		System.out.println("사용자 정보 출력~");
	}

	// 폐기 메서드
	@PreDestroy
	public void destroyUser() {
		System.out.println("유저 폐기");
	}
}
```

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");

		User user = context.getBean(User.class);
		user.printUser();

		((AnnotationConfigApplicationContext) context).close();
	}
}
```

예제에서는 간단히 문자열을 출력하였지만, 예를들어 파일을 스트림으로 열고 write 기능을 수행하는 POJO가 있다면 초기화 메서드엔 해당 디렉토리와 파일이 있는지 체크해서 없으면 생성하는 로직을 넣을 수 있고 폐기 메서드엔 스트림을 닫는 코드를 넣을 수 있다.

## 3. @Lazy로 느긋하게 POJO 초기화

기본적으로 스프링은 IoC컨테이너가 인스턴스화 되는 순간에 빈 인스턴스들을 초기화 하는데( _eager initialization_ ) 빈에 @Lazy를 붙여서 느긋한 초기화를 할 수 있다.

```java{numberLines: true}
@Component
@Lazy
public class Phone {

	@PostConstruct
	public void initPhone() {
		System.out.println("휴대폰 초기화");
	}

	public void printPhone() {
		System.out.println("휴대폰 정보 출력~");
	}
}
```

위의 Phone에 @Lazy를 붙여 느긋한 초기화를 할 것이다. 그럼 IoC컨테이너를 인스턴스화 해도 initPhone 메서드는 실행되지 않는다.

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");
		((AnnotationConfigApplicationContext) context).close();
	}
}
```

아래와 같이 getBean() 메서드로 빈을 찾을 때 초기화 된다.

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");

		// 이 시점에 빈 인스턴스 초기화
		Phone phone = context.getBean(Phone.class);

		((AnnotationConfigApplicationContext) context).close();
	}
}
```

이렇게 느긋하게 초기화를 하면 애플리케이션 시동 시점에 리소스를 집중 소모하지 않아도 되므로 전체 시스템 리소스를 절약할 수 있다. 그리고 네트워크 접속, 파일 처리등의 무거운 작업을 처리하는 POJO는 느긋한 초기화가 더 어울린다.

## 4. @DependsOn으로 초기화 순서 정하기

POJO가 늘어나면 그에 따라 POJO 초기화 횟수도 증가한다. 그리고 어떤 POJO는 다른 POJO가 먼저 초기화 되어야 정상 동작될 수도 있다. 그런 경우 @DependsOn으로 POJO의 초기화 순서를 정한다. 예를 들어 User가 초기화 되기 전에 무조건 Phone이 먼저 초기화 되어야 하는 상황이다.

```java{numberLines: true}
@Configuration
public class AppConfiguration {

	@Bean
	public User user() {
		User user = new User();
		return user;
	}

	@Bean
	public Phone phone() {
		Phone phone = new Phone();
		return phone;
	}
}
```

이렇게 자바 구성 클래스로 IoC컨테이너를 인스턴스화 하면 결과는 다음과 같다.

```shell
유저 초기화
휴대폰 초기화
유저 폐기
```

User보다 먼저 Phone을 초기화 하려면 @DependsOn에 "phone"을 넣고 붙이면 된다. 만약 여러 빈을 등록하고 싶으면 CSV 형태로 지정할 수 있다. (예: @DependsOn({"phone", "department", "company"}))

```java{numberLines: true}
@Bean
@DependsOn("phone")
public User user() {
	User user = new User();
	return user;
}
```

물론 위의 예제에서는 그냥 Phone을 만드는 빈 정의부를 User 빈 정의부 위에 선언하면 된다. 그러나 POJO가 많아짐에 따라 빈 정의를 여러군데에서 하게 되는데, 분산 선언된 많은 POJO를 서로 참조시킬 때 사용하면 되겠다.

여기까지 POJO 생성/소멸 시 실행하는 메서드를 설정하는 방법과 POJO 초기화에 대해 알아보았다. 다음 글에선 후처리기를 만들어 POJO를 검증/수정 하는법에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
