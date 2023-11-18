import { chromium } from 'playwright';
import "dotenv/config"

async function purchaseLotto() {
  const browser = await chromium.launch({headless : true})
  const page = await browser.newPage()
  await page.goto("https://dhlottery.co.kr/user.do?method=login")
  await page.getByPlaceholder("아이디").fill(process.env.ID)
  await page.getByPlaceholder("비밀번호").fill(process.env.PASSWORD)
  await page.getByRole("group").getByRole("link", {name: "로그인"}).click()

  await page.goto("https://ol.dhlottery.co.kr/olotto/game/game645.do")
  const balanceStr = await page.locator("#moneyBalance").textContent()
  const balance = parseInt(balanceStr.replace(",",""))

  if(balance === 0) {
    await browser.close()
  }

  await page.getByText("자동번호발급").click()
  await page.selectOption("select", String(1))
  await page.getByRole("button", { name: "확인"}).click()
  await page.getByRole("button", { name: "구매하기"}).click()
  await page.locator("#popupLayerConfirm").getByRole("button", { name: "확인" }).click()

  await page.locator("#report").getByRole("button", { name: "확인"}).click()

  await browser.close()
}

await purchaseLotto()