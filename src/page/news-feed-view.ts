import View from "../core/view";
import { NewsFeedApi } from "../core/api";
import { NewsStore } from "../types";
import { NEWS_URL } from "../config";

const template: string = `
<div class="bg-gray-600 min-h-screen">
  <div class="bg-white text-xl">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex justify-start">
          <h1 class="font-extrabold">Hacker News</h1>
        </div>
        <div class="items-center justify-end">
          <a href="#/page/{{__prev_page__}}">Prev</a>
          <a href="#/page/{{__next_page__}}">Next</a>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4 text-2xl text-gray-700">{{__news_feed__}}</div>
</div>
`;

// 목록 화면
export default class NewsFeedView extends View {
  private api: NewsFeedApi;
  private store: NewsStore;

  constructor(containerId: string, store: NewsStore) {
    super(containerId, template);

    this.store = store;
    this.api = new NewsFeedApi(NEWS_URL);
    // const api = new NewsFeedApi();

    if (!this.store.hasFeeds) {
      this.store.setFeed(this.api.getData());
    }
  }

  render(): void {
    this.store.currentPage = Number(location.hash.substring(7) || 1);
    // 현재 1페이지를 보고있으면 배열의 0부터 시작해야하니 -1
    // 하지만 다음페이지가 되면 한 페이지당 목록의 갯수는 10개이니 * 10 을 해준다.
    for (
      let i = (this.store.currentPage - 1) * 10;
      i < this.store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, user, points, time_ago, read } =
        this.store.getFeed(i);
      this.addHtml(`
      <div class="p-6 ${
        read ? "bg-red-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>
        </div>
      </div>
  `);
    }

    this.setTemplate("news_feed", this.getHtml());
    this.setTemplate("prev_page", String(this.store.prevPage));
    this.setTemplate("next_page", String(this.store.nextPage));

    this.updateView();
  }
}
