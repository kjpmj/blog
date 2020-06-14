---
title: 05. 스프링 코어 - POJO 스코프 설정
issueNumber: '29'
createAt: 2020-06-12 23:19
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 05
---

## 1. 스코프 종류

IoC컨테이너의 getBean() 메서드로 빈을 요청하거나 다른 빈에서 참조할 때 스프링은 빈 스코프에 따라 어느 빈 인스턴스를 반환할지 결정해야 한다. 이때 기본 빈 스코프 이외의 다른 스코프를 지정할 수 있다. 스프링의 빈 스코프 종류는 다음과 같다.

- **singleton**
  : IoC컨테이너당 빈 인스턴스 하나를 생성
- **prototype**
  : 요청할 때마다 빈 인스턴스를 새로 생성
- **request**
  : HTTP 요청당 하나의 빈 인스턴스를 생성, 웹 애플리케이션 컨텍스트에만 해당
- **session**
  : HTTP 세션당 하나의 빈 인스턴스를 생성, 웹 애플리케이션 컨텍스트에만 해당
- **globalSession**
  : 전역 HTTP 세션당 빈 인스턴스 하나를 생성, 포털 애플리케이션 컨텍스트에만 해당

이 중에서 기본 스코프는 `singleton`이다. 그래서 따로 스코프를 설정하지 않으면 IoC컨테이너에 선언한 빈마다 하나의 빈 인스턴스를 생성한다. 그리고 이렇게 만들어진 인스턴스는 전체 컨테이너 스코프에 공유된다.

## 2. 예제

다음의 예제는 쇼핑몰 장바구니를 간단히 구성했다. ShoppingCart에는 Product 리스트가 있고 Monitor, Mouse, Keyboard는 Product의 구현체이다.

```java{numberLines: true}
@Component
public class ShoppingCart {
	private List<Product> products = new ArrayList<Product>();

	public void addProduct(Product product) {
		products.add(product);
	}

	public List<Product> getProducts() {
		return products;
	}
}
```

```java{numberLines: true}
@Component
public class Monitor implements Product{

	@Override
	public String getName() {
		return "모니터";
	}
}

@Component
public class Mouse implements Product{

	@Override
	public String getName() {
		return "마우스";
	}
}

@Component
public class Keyboard implements Product{

	@Override
	public String getName() {
		return "키보드";
	}
}
```

쇼핑몰 첫번째 고객이 키보드와 마우스를 장바구니에 담았다.

```java{numberLines: true}
public class App {
	public static void main(String[] args) {
		ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");

		ShoppingCart cart1 = context.getBean(ShoppingCart.class);
		cart1.addProduct(new Mouse());
		cart1.addProduct(new Monitor());

		System.out.println("------ 장바구니1의 물품 ------");

		cart1.getProducts().forEach(product -> {
			System.out.println(product.getName());
		});
	}
}
```

결과는 당연히 카트1에 마우스와 모니터가 담겼다.

```shell
------ 장바구니1의 물품 ------
마우스
모니터
```

그런데 두번째 고객이 접속해서 키보드를 장바구니에 담았다.

```java{numberLines: true}
public class App {
    public String getGreeting() {
        return "Hello world.";
    }

    public static void main(String[] args) {
    	ApplicationContext context = new AnnotationConfigApplicationContext("my.spring.demo");

    	ShoppingCart cart1 = context.getBean(ShoppingCart.class);
    	cart1.addProduct(new Mouse());
    	cart1.addProduct(new Monitor());

    	System.out.println("------ 장바구니1의 물품 ------");

    	cart1.getProducts().forEach(product -> {
    		System.out.println(product.getName());
    	});

    	ShoppingCart cart2 = context.getBean(ShoppingCart.class);
    	cart2.addProduct(new Keyboard());

    	System.out.println("------ 장바구니2의 물품 ------");

    	cart2.getProducts().forEach(product -> {
    		System.out.println(product.getName());
    	});
    }
}
```

현재는 스코프를 따로 설정하지 않아서 첫번째 고객과 두번째 고객이 쇼핑카트를 공유한다.

```shell
------ 장바구니1의 물품 ------
마우스
모니터
------ 장바구니2의 물품 ------
마우스
모니터
키보드
```

이럴 때 쇼핑카트에 빈 스코프를 설정하여 쇼핑카트를 각자 소유하게 해야한다.

```java{numberLines: true}
@Component
@Scope("prototype")
public class ShoppingCart {
	...
}
```

그러면 결과는 다음과 같다.

```shell
------ 장바구니1의 물품 ------
마우스
모니터
------ 장바구니2의 물품 ------
키보드
```

여기까지 빈 스코프에 대해 알아보았다. 다음 글에선 외부 리소스 데이터를 사용하는 법에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
