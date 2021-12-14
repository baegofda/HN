import { NewsFeed, NewsDetail } from "../types";

export class Api {
  url: string;
  ajax: XMLHttpRequest;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

export class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

//======================================================================= mixin 기법
// extends -> 관계를 유연하게 가져갈수 없다.
// js, ts 에서는 다중 상속을 지원하지 않기때문에
// function applyApiMixins(targetClass: any, baseClasses: any) {
//   baseClasses.forEach((baseClass: any) => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         baseClass.prototype,
//         name
//       );

//       if (descriptor) {
//         Object.defineProperty(targetClass.prototype, name, descriptor);
//       }
//     });
//   });
// }

// class Api {
//   getRequest<AjaxResponse>(url: string): AjaxResponse {
//     ajax.open("GET", url, false);
//     ajax.send();

//     return JSON.parse(ajax.response);
//   }
// }

// class NewsFeedApi {
//   getData(): NewsFeed[] {
//     return this.getRequest<NewsFeed[]>(NEWS_URL);
//   }
// }
// class NewsDetailApi {
//   getData(id: string): NewsDetail {
//     return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", id));
//   }
// }

// ts 에서 class Api 와의 연관관계를 추적하지 못하기때문에 명시
// interface NewsFeedApi extends Api {}
// interface NewsDetailApi extends Api {}

// applyApiMixins(NewsFeedApi, [Api]);
// applyApiMixins(NewsDetailApi, [Api]);
//======================================================================= mixin 기법
