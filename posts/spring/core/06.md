---
title: 06. 스프링 코어 - POJO 외부 리소스 사용하기
issueNumber: '30'
createAt: 2020-06-14 21:28
# mainImage: ../../src/images/Spring02.png
description: 스프링 코어 06
---

스프링이 제공하는 기능을 이용하면 텍스트, XML, 프로퍼티, 이미지 파일등의 외부 리소스 파일의 데이터를 쉽게 사용할 수 있다.

## 1. 프로퍼티 파일 읽기

**@PropertySource**와 **PropertySourcesPlaceholderConfigurer**를 이용하면 .properties 파일을 읽을 수 있다. 다음의 예제는 discounts.properties 파일에 마우스 할인율을 설정하고 할인율이 적용된 가격을 조회하는 내용이다.

```shell
# discounts.properties
mouse.discount=0.2
```

```java{numberLines: true}
public class Mouse implements Product{

	private double price;
	private double discount;

	public Mouse(double price, double discount) {
		this.price = price;
		this.discount = discount;
	}

	@Override
	public String getName() {
		return "마우스";
	}

	public double getPrice() {
		return price - (price * discount);
	}
}
```

```java{numberLines: true}
@Configuration
@PropertySource("classpath:discounts.properties")
@ComponentScan("my.spring.demo")
public class ShopConfiguration {

	@Value("${mouse.discount}")
	private double mouseDiscount;

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}

	@Bean
	public Product mouse() {
		return new Mouse(1000, mouseDiscount);
	}
}
```

```shell
마우스의 가격: 800.0
```

@PropertySource에 `classpath:`를 붙이면 스프링은 자바 클래스패스에서 `classpath:` 뒤에 오는 파일을 찾는다. 그리고 @PropertySource를 붙여 프로퍼티 파일을 로드하려면 PropertySourcesPlaceholderConfigurer 빈을 @Bean으로 선언해야 한다. 그러면 스프링은 해당 파일을 찾아 자동으로 연결하므로 파일에 나열된 프로퍼티를 사용할 수 있다. discounts.properties 파일에서 가져온 값을 담을 자바 변수를 선언하고 @Value에 표현식을 넣어 프로퍼티 값을 자바 변수에 할당한다. `@Value("\${key:default_value})`구문으로 선언하면 읽어들인 파일에서 key를 찾고 매치되는 키가 없으면 defalut_value를 변수에 할당한다.

## 2. 외부 리소스 파일 데이터 읽기

애플리케이션 시동 시 클래스패스에 위치한 banner.txt라는 텍스트 파일 안에 넣은 문구를 출력하고자 한다.

```shell
*******************************************************************************************
_ _ _ ____ _    ____ ____ _  _ ____    ___ ____    _  _ _   _    ____ _  _ ____ ___       /
| | | |___ |    |    |  | |\/| |___     |  |  |    |\/|  \_/     [__  |__| |  | |__]     /
|_|_| |___ |___ |___ |__| |  | |___     |  |__|    |  |   |      ___] |  | |__| |       .

*******************************************************************************************
```

다음 BannerLoader는 배너를 읽어 콘솔에 출력하는 POJO 클래스이다.

```java{numberLines: true}
public class BannerLoader {

	private Resource banner;

	public void setBanner(Resource banner) {
		this.banner = banner;
	}

	@PostConstruct
	public void showBanner() throws IOException {
		Files.lines(Paths.get(banner.getURI()), Charset.forName("UTF-8"))
			.forEachOrdered(System.out::println);
	}
}
```

banner 필드는 스프링 Resource형으로 선언했고 그 값은 빈 인스턴스 생성 시 세터 주입으로 채운다. 그리고 애플리케이션 시동 시 showBanner 메서드를 실행시키기 위해 @PostConstruct를 붙였다.

```java{numberLines: true}
@Configuration
@ComponentScan("my.spring.demo")
public class ShopConfiguration {
	@Value("classpath:banner.txt")
	private Resource banner;

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}

	@Bean
	public BannerLoader bannerLoader() {
		BannerLoader bl = new BannerLoader();
		bl.setBanner(banner);
		return bl;
	}
}
```

`@Value("classpath:banner.txt")` 덕분에 스프링은 클래스패스에서 banner.txt 파일을 찾아 banner 프로퍼티에 주입한다. 예제에선 클래스패스에서 배너 파일을 가져왔지만 파일시스템 절대경로에서도 가져올 수 있다.

```shell
file:c:/shop/banner.txt
```

혹은 특정 패키에 위치한 리소스는 클래스패스 루트부터 절대 경로로 명시하면 된다.

```shell
classpath:my/spring/demo/shop/banner.txt
```

시스템 경로, 클래스패스뿐만 아니라 URL로 위치를 특정할 수 있다.

```shell
https://kjpmj-blog.netlify.app/shop/banner.txt
```

지금까지는 @Value를 통해 외부 리소스를 사용하는 법을 알아보았는데, 스프링은 @Value를 통하지 않고 외부 리소스를 사용하는 법도 제공한다.

```java{numberLines: true}
public static void main(String[] args) throws IOException {
	Resource resource = new ClassPathResource("discounts.properties");
	Properties props = PropertiesLoaderUtils.loadProperties(resource);

	System.out.println(props);
}
```

물론 클래스패스 말고 파일시스템, URL로도 외부 리소스를 사용할 수 있다.

```java{numberLines: true}
Resource resource = new FileSystemResource("c:/shop/banner.txt");
Resource resource = new UrlResource("https://kjpmj-blog.netlify.app/shop/banner.txt");
```

여기까지 스프링에서 외부 리소스를 사용하는 법에 대해 알아보았다. 다음 글에선 POJO 초기화/폐기에 대해 알아보자.

<br/><br/>

참고자료: 스프링 5 레시피 (한빛 미디어)
