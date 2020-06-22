---
title: 09. 스프링 코어 - 환경에 따라 다른 POJO 로드하기
issueNumber: '33'
createAt: 2020-06-17 20:54
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 09
---

동일한 POJO임에도 애플리케이션을 실행하는 환경에 따라 POJO 초기값을 달리해야 하는 경우가 있다. 가장 흔한 예로는 개발, 테스트, 운영 환경 별로 DB 접속 정보가 달라지는 경우를 들 수 있겠다. 아래의 예제는 DB 접속 정보를 갖고 있는 빈 인스턴스를 정의한 두 개의 자바 구성 클래스에 @Profile를 붙여서 개발, 운영 환경에 따라 DB 접속 정보를 달리하는 예제이다.

```java{numberLines: true}
public class DatabaseProperty {
	private String user;
	private String password;

	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
```

```java{numberLines: true}
@Configuration
@Profile("dev")
public class DatabaseConfigureDev {

	@Bean
	public DatabaseProperty databaseProperty() {
		DatabaseProperty dp = new DatabaseProperty();
		dp.setUser("user_dev");
		dp.setPassword("password_dev");

		return dp;
	}
}

@Configuration
@Profile("prod")
public class DatabaseConfigureProd {

	@Bean
	public DatabaseProperty databaseProperty() {
		DatabaseProperty dp = new DatabaseProperty();
		dp.setUser("user_prod");
		dp.setPassword("password_prod");

		return dp;
	}
}
```

## 1. setActiveProfiles()로 설정하기

위와 같이 두 개의 자바 구성 클래스를 프로파일에 따라 로드하려면 일단 프로파일을 활성화 시켜야 한다. 활성화 시키는 두 가지 방법이 있는데 그 중 첫번째는 애플리케이션 컨텍스트를 활용하면 된다. 먼저 컨텍스트 환경을 갸져와서 setActiveProfiles() 메서드에 로드할 프로파일을 넣으면 된다.

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();

			context.getEnvironment().setActiveProfiles("dev");
			context.scan("my.spring.demo");
			context.refresh();

			DatabaseProperty dp = context.getBean(DatabaseProperty.class);
			System.out.println("유저: " + dp.getUser() + "\n패스워드: " + dp.getPassword());
	}
}
```

```shell
유저: user_dev
패스워드: password_dev
```

## 2. spring.profiles.active로 설정하기

두번째 방법은 자바 런타임 플래그로 로드할 프로파일을 명시하면 된다. 다음은 위의 예제에서 프로파일을 설정하는 부분을 제거하고 executable jar로 만든 다음 실행한 결과이다.

```shell
java -jar -Dspring.profiles.active=prod ./build/libs/my-spring-demo-009.jar
유저: user_prod
패스워드: password_prod
```

그리고 만약 어떤 프로파일도 애플리케이션에 로드 되지 않는 상황을 막으려면 기본 프로파일을 설정하면 된다. 기본 프로파일은 스프링이 활성 프로파일을 하나도 찾지 못할 경우 적용되는데, setDefaultProfiles() 메서드로 설정하거나 실행 시 spring.profiles.default를 설정하면 된다.

여기까지 환경에 따라 다른 POJO를 로드하는 법에 대해 알아보았다. 다음은 어노테이션을 활용한 AOP에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
