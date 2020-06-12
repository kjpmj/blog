---
title: 04. 스프링 코어 - POJO 자동연결
issueNumber: '28'
createAt: 2020-06-10 22:38
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 04
---

스프링으로 만든 애플리케이션은 스프링 빈들이 서로 상호작용하여 하나의 기능을 완수한다. 빈 인스턴스들의 관계는 자바 표준 코드로도 맺어줄 수 있고 Spring이 제공하는 방식으로도 맺어줄 수 있다.

## 1. @Autowired 활용

스프링이 제공하는 @Autowired 어노테이션을 생성자, 필드, 메서드 등에 붙이면 등록된 빈에서 해당 타입에 맞는 빈을 찾아 자동으로 연결하여 사용할 수 있다.

<br/>

### 1-1. 필드에 적용

```java{numberLines: true}
@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private UserDao userDao;

	@Override
	public User findUserById(String id) {
		return userDao.findUserById(id);
	}
}
```

위의 코드는 앞의 글에서 UserDaoImpl을 호출하는 서비스 계층의 코드이다. 4~5번째 라인에서 UserDaoImpl의 인터페이스인 UserDao에 @Autowired를 붙였다. 그러면 스프링은 UserDao와 타입이 호환되는 빈을 찾아서 자동으로 userDao 필드에 연결해준다. 만약 타입이 호환되는 빈이 없으면 UnsatisfiedDependencyException이 발생하는데 이 부분에서 예외를 던지지 않고 넘어가게 하려면 @Autowired의 required 속성값을 false로 지정한다.

```java{numberLines: true}
@Autowired(required = false)
	private UserDao userDao;
```

그리고 Type-Safe한 컬렉션에 @Autowired를 붙이면 해당 타입과 호환되는 빈을 모두 찾아 연결해준다.

```java{numberLines: true}
@Autowired
	private List<UserDao> userDaoList;
```

<br/>

### 1-2. 메서드에 적용

```java{numberLines: true}
@Service
public class UserServiceImpl implements UserService{

	private UserDao userDao;

	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public User findUserById(String id) {
		return userDao.findUserById(id);
	}
}
```

@Autowired를 세터 메서드에 적용한 코드이다. 굳이 메서드명 앞에 set이 들어가지 않아도 스프링은 메서드의 파라미터 타입과 호환되는 빈을 찾아 연결하기 때문에 아래와 같이 사용해도 된다.

```java{numberLines: true}
private UserDao userDao;

@Autowired
public void anyNameMethod(UserDao userDao) {
	this.userDao = userDao;
}
```

<br/>

### 1-3. 생성자에 적용

```java{numberLines: true}
@Service
public class UserServiceImpl implements UserService{

	private UserDao userDao;

	@Autowired
	public UserServiceImpl(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public User findUserById(String id) {
		return userDao.findUserById(id);
	}
}
```

생성자에서 @Autowired를 붙여도 동작한다. 참고로 스프링 4.3 버전부터 생성자가 하나뿐인 클래스의 생성자는 자동 연결하는 것이 기본이므로 @Autowired를 붙이지 않아도 된다. 그래서 아래와 같은 코드도 동작한다.

```java{numberLines: true}
@Service
public class UserServiceImpl implements UserService{

	private UserDao userDao;

	public UserServiceImpl(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public User findUserById(String id) {
		return userDao.findUserById(id);
	}
}
```

<br/>

### 1-4. 모호한 자동연결 @Primary 활용

IoC컨테이너에 호환 되는 타입을 가진 인스턴스들이 여럿 있는 경우 타입을 기준으로 자동 연결을 하면 원하는 인스턴스에 연결이 되지 않을 수 있다. 이 경우엔 @Primary를 활용하여 특정 빈에 우선권을 부여한다. 아래 예제를 살펴보자. Car 클래스는 Tire를 필드로 갖고 있다. HankookTire와 KumhoTire는 Tire인터페이스의 구현체이고 빈으로 등록했다.

```java{numberLines: true}
@Component
public class Car {
	@Autowired
	private Tire tire;

	public Tire getTire() {
		return tire;
	}
}
```

```java{numberLines: true}
@Component
@Primary
public class HankookTire implements Tire{

	@Override
	public String getTireName() {
		return "한국타이어";
	}

}
```

```java{numberLines: true}
@Component
public class KumhoTire implements Tire{

	@Override
	public String getTireName() {
		return "금호타이어";
	}
}
```

HankookTire 클래스에 2번째 줄에 @Primary를 설정했다. 그럼 Car 클래스의 Tire는 HankookTire 인스턴스와 자동 연결 된다.

```shell
어떤 타이어: 한국타이어
```

<br/>

### 1-5. 모호한 자동연결 @Qualifier 활용

@Primary말고 @Qualifier을 사용하여 해결할 수도 있다. @Qualifier에 연결하고 싶은 빈의 이름을 넣으면 된다.

```java{numberLines: true}
@Component
public class Car {
	@Autowired
	@Qualifier("kumhoTire")
	private Tire tire;

	public Tire getTire() {
		return tire;
	}
}
```

한국타이어에 @Primary를 설정하고 @Qualifier를 금호타이어로 했을 때 금호타이어가 자동연결 된다.

```shell
어떤 타이어: 금호타이어
```

<br/>

## 2. 자바 표준 어노테이션 활용

스프링이 @Autowired를 선보이고 얼마 지나지 않아 자바 진영에서도 **javax.annotation.Resource**와 **javax.inject.Inject**라는 동일한 기능의 어노테이션을 표준화 했다.

<br/>

### 2-1. @Resource 활용

타입으로 POJO를 찾아 자동 연결하는 기능은 @Resource나 @Autowired나 마찬가지이다. 차이점이 있다면 @Resource는 이름을 먼저 검색하고 없으면 타입으로 검색하는 방식이고, @Autowired는 타입으로 먼저 검색하고 없으면 이름으로 검색하는 방식이다. 그리고 @Resource는 생성자에 붙이면 안된다.

```java{numberLines: true}
@Component
public class Car {
	@Resource(name = "kumhoTire")
	private Tire tire;

	public Tire getTire() {
		return tire;
	}
}
```

@Resource를 타입으로 검색할 때 @Autowired처럼 이름으로 검색하고 싶으면 @Qualifier를 붙이는 대신 name 속성을 지정하면 된다.

```java{numberLines: true}
@Resource(name = "kumhoTire")
	private Tire tire;
```

<br/>

여기까지 POJO 자동연결에 대해 알아보았다. 다음 글에선 이러한 POJO 인스턴스를 IoC컨테이너에서 가져올 때 스코프를 설정해서 갖고 오는 법에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
