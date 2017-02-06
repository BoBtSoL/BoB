import { BoBMusicClientAngularPage } from './app.po';

describe('bo-bmusic-client-angular App', function() {
  let page: BoBMusicClientAngularPage;

  beforeEach(() => {
    page = new BoBMusicClientAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
