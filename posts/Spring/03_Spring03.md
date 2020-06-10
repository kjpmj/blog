---
title: 03. 스프링 코어 - POJO 구성
issueNumber: '26'
createAt: 2020-06-04 23:48
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 03
---

앞의 글의 예제에선 Xml를 이용하여 IoC컨테이너를 구성하였다. 그런데 Xml 말고 **@Configuration, @Bean** 어노테이션을 붙인 자바 구성 클래스를 만들거나, **@Component, @Repository, @Service, @Controller** 등의 어노테이션을 붙인 자바 컴포넌트를 이용하여 IoC컨테이너를 구성할 수 있다. IoC컨테이너는 이렇게 어노테이션이 붙은 자바 클래스를 스캐닝하여 POJO 인스턴스를 구성한다. 그럼 예제를 통해 알아보자.

## 1. 자바로 POJO 구성하기

### 1-1. @Configuration과 @Bean 활용

```java{numberLines: true}
@Configuration
public class CarConfiguration {

	@Bean
	public Car carGenerator() {
		Car car = new Car();
		car.setName("GV80");

		return car;
	}
}
```

CarConfiguration 클래스에 붙인 @Configuration은 이 클래스가 구성 클래스임을 스프링에게 알린다. 스프링은 @Configuration이 달린 클래스를 보면 일단 그 안에 @Bean이 붙은 메서드를 찾는다. 메서드에 @Bean을 붙이면 메서드명과 동일한 이름의 빈이 생성되는데, 빈의 이름을 따로 명시하고 싶으면 @Bean에 name 속성을 지정한다. @Bean(name="gv80") 이렇게 붙이면 "gv80"이라는 빈이 생성된다. 이제 이 구성 클래스를 스캐닝하여 빈을 사용하려면 IoC컨테이너를 인스턴스화 해야한다.

스프링은 기본 구현체인 빈 팩토리(bean factory)와 이와 호환되는 고급 구현체인 애플리케이션 컨텍스트(application context), 두 가지 IoC컨테이너를 제공한다. 애플리케이션 컨텍스트가 기본에 충실하면서도 빈 팩토리보다 발전된 기능을 지니고 있으므로 가급적 애플리케이션 컨텍스트를 사용하는 게 좋다고 한다. 이 부분에 대해서 조금 더 살펴보면 `ApplicationContext`가 `BeanFactory`를 상속하는 구조인데, ApplicationContext는 인스턴스화 할 때 미리 빈 인스턴스를 만드는 `pre-loading` 방식이고 BeanFactory는 인스턴스화 하고 빈을 호출 하는 시점에 빈 인스턴스를 만드는 `lazy-loading` 방식이다. 하여튼 둘 다 인터페이스이므로 사용하려면 구현체가 필요하다. 스프링이 제공하는 ApplicationContext의 구현체가 몇 가지 있는데 그 중에 AnnotationConfigApplicationContext를 사용해보자.

```java{numberLines: true}
public class App {
  public static void main(String[] args) {
    ApplicationContext context = new AnnotationConfigApplicationContext(CarConfiguration.class);

    Car car = (Car)context.getBean("carGenerator");

    System.out.println(car.getName());
  }
}
```

3번째 줄에서 ApplicationContext를 인스턴스화 하고 5번째 줄에서 Car 빈을 가져와서 사용하였다. getBean 메서드는 java.lang.Object 타입을 반환하므로 실제 타입에 맞게 캐스팅해야한다. 캐스팅을 안 하려면 getBean() 메서드의 두 번째 인수에 빈 클래스를 지정한다. 빈이 하나뿐이라면 빈의 이름을 생략해도 된다.

```java{numberLines: true}
Car car2 = context.getBean("carGenerator", Car.class);
Car car3 = context.getBean(Car.class);
```

### 1-2. @Component 활용

위의 예제에선 @Configuration과 @Bean을 이용하여 스프링 빈을 인스턴스화 했다. 간단한 스프링 예제로는 안성맞춤이지만 이제 조금 더 현실적인 시나리오를 생각해보자.
실제 엔터프라이즈 개발에선 DB를 이용하겠지만 여기선 간단하게 userList를 만들었다. 그리고 findUserById 메서드는 id 값을 파라미터로 받아 해당되는 User 객체를 반환한다.

```java{numberLines: true}
@Component("userDao")
public class UserDaoImpl implements UserDao{

	private List<User> userList = new ArrayList<>();

	public UserDaoImpl() {
		userList.add(new User("100","메시", 28));
		userList.add(new User("101", "호날두", 30));
	}

	@Override
	public User findUserById(String id) {
		Optional<User> maybeUser = userList.stream()
			.filter(user -> user.getId().equals(id))
			.findFirst();

		return maybeUser.orElse(new User());
	}
}
```

UserDaoImpl 클래스에 @Component("userDao")를 붙였다. 그러면 스프링은 이 클래스를 이용해 POJO를 생성한다. @Component에 넣은 값(userDao)을 인스턴스 ID로 설정하는데, 값이 없으면 소문자로 시작하는 클래스명을 빈 이름으로 기본 할당한다. 만약 위의 클래스에 @Component만 붙인다면 빈 이름은 userDaoImpl이다.

스프링은 계층에 따라 @Repository, @Service, @Controller 라는 어노테이션을 붙여 빈을 생성할 수 있다. 만약 POJO의 쓰임새가 명확하지 않다면 @Component를 붙인다. 대신 특정 용도에 맞는 어노테이션을 사용하면 부가적인 혜택을 누릴 수 있다고 한다.

앞서 작성한 컴포넌트를 Main클래스에서 테스트 해보자

```java{numberLines: true}
public class App {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");

        UserDao userDao = context.getBean(UserDaoImpl.class);
        User user = userDao.findUserById("100");

        System.out.println("userName: " + user.getName() + " userAge: " + user.getAge());
    }
}
```

```shell
userName: 메시 userAge: 28
```

여기까지 기본적인 스프링 IoC컨테이너를 인스턴스화 하고 생성된 빈을 사용하는 법을 알아보았다. 다음 글에선 POJO 래퍼런스 자동연결에 대해 알아보자.

<br/><br/>
출처: 스프링 5 레시피 (한빛 미디어)
