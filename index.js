import { chromium } from 'playwright';
import "dotenv/config"

/**
 * @param {number} purchaseQuantity - 로또 구매 수량
 */
async function purchaseLotto(purchaseQuantity) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto("https://dhlottery.co.kr/user.do?method=login")
  await page.getByPlaceholder("아이디").fill(process.env.ID)
  await page.getByPlaceholder("비밀번호").fill(process.env.PASSWORD)
  await page.getByRole("group").getByRole("link", {name: "로그인"}).click()

  const [balanceStr] = (await page.locator("body > div:nth-child(1) > header > div.header_con > div.top_menu > form > div > ul.information > li.money > a:nth-child(2) > strong").textContent()).split("원")

  if(parseInt(balanceStr) === 0) { // 잔액부족으로 구매 할 수 없는 상황
    await browser.close()
    return
  }

  await page.goto("https://ol.dhlottery.co.kr/olotto/game/game645.do")
  await page.getByText("자동번호발급").click()
  await page.selectOption("select", String(purchaseQuantity))
  await page.getByRole("button", { name: "확인"}).click()
  await page.getByRole("button", { name: "구매하기"}).click()
  await page.locator("#popupLayerConfirm").getByRole("button", { name: "확인" }).click()

  await page.locator("#report").getByRole("button", { name: "확인"}).click()

  await browser.close()
}

await purchaseLotto(1)