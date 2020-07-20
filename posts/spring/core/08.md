---
title: 08. 스프링 코어 - 후처리기를 만들어 POJO 검증/수정
issueNumber: '32'
createAt: 2020-06-17 13:18
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 08
---

빈을 생성하고 해당 빈이 잘 생성되었는지 검증하거나 혹은 조건에 따라 빈을 수정하고 싶은 경우가 있을 수 있다. 그럴 경우 스프링이 제공하는 BeanPostProcessor 인터페이스를 구현한 빈 후처리기를 만들어서 사용하면 된다.

## 1. BeanPostProcessor를 구현한 빈 후처리기

스프링은 BeanPostProcessor를 구현한 빈을 발견하면 자신이 관장하는 모든 빈 인스턴스에 postProcessBeforeInitialization(), postProcessAfterInitialization() 두 메서드를 적용한다. 이름에서 알 수 있듯이 각각 빈 초기화 전후에 실행되는 메서드이다.

```java{numberLines: true}
@Component
public class TireCheckBeanPostProcessor implements BeanPostProcessor{

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println(
			"In TireCheckBeanPostProcessor.postProcessBeforeInitialization > "
			+ bean.getClass()
		);

		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println(
			"In TireCheckBeanPostProcessor.postProcessAfterInitialization > "
			+ bean.getClass()
		);

		return bean;
	}
}
```

두 메서드는 하는 일이 없어도 bean을 반환해야 한다. 현재 예제에서는 Car, HankookTire, KumhoTire 3개의 빈이 존재한다. 그리고 HankookTire에는 @PostConstruct가 붙은 초기화 메서드가 있다. 그럼 결과는 다음과 같다. 모든 빈에 두 메서드가 적용된 모습을 볼 수 있다.

```shell
In TireCheckBeanPostProcessor.postProcessBeforeInitialization > class my.spring.demo.car.KumhoTire
In TireCheckBeanPostProcessor.postProcessAfterInitialization > class my.spring.demo.car.KumhoTire
In TireCheckBeanPostProcessor.postProcessBeforeInitialization > class my.spring.demo.car.Car
In TireCheckBeanPostProcessor.postProcessAfterInitialization > class my.spring.demo.car.Car
In TireCheckBeanPostProcessor.postProcessBeforeInitialization > class my.spring.demo.car.HankookTire
한국타이어 초기화
In TireCheckBeanPostProcessor.postProcessAfterInitialization > class my.spring.demo.car.HankookTire
```

특정 타입의 빈만 처리하고 싶으면 아래와 같이 하면 된다. 아래 예제에선 Tire 타입의 HankookTire와 KumhoTire 빈만 메세지를 출력한다.

```java{numberLines: true}
@Component
public class TireCheckBeanPostProcessor implements BeanPostProcessor{

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		if(bean instanceof Tire) {
			System.out.println(
				"In TireCheckBeanPostProcessor.postProcessBeforeInitialization > "
				+ bean.getClass()
			;
		}

		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		if(bean instanceof Tire) {
			System.out.println(
				"In TireCheckBeanPostProcessor.postProcessAfterInitialization > "
				+ bean.getClass()
			);
		}

		return bean;
	}
}
```

```shell
In TireCheckBeanPostProcessor.postProcessBeforeInitialization > class my.spring.demo.car.KumhoTire
In TireCheckBeanPostProcessor.postProcessAfterInitialization > class my.spring.demo.car.KumhoTire
In TireCheckBeanPostProcessor.postProcessBeforeInitialization > class my.spring.demo.car.HankookTire
한국타이어 초기화
In TireCheckBeanPostProcessor.postProcessAfterInitialization > class my.spring.demo.car.HankookTire
```

여기까지 빈 후처리기를 만들어 빈 초기화 전후에 POJO를 다루는 법을 알아보았다. 다음 글에선 환경에 따라 다른 POJO를 로드하는 법에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
