import { chromium } from 'playwright';
import "dotenv/config"

import { sendMessage } from './slackClient.js';

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

  await page.goto("https://ol.dhlottery.co.kr/olotto/game/game645.do")
  const balanceStr = await page.locator("#moneyBalance").textContent()
  const balance = parseInt(balanceStr.replace(",",""))

  await sendMessage(`TEST: 잔고는 ${balance} 원 입니다`)

 //  if(balance === 1000) {
 //    await sendMessage("잔액을 충전하지 않으면 다음 회차부터 구매할 수 없습니다")
 //  }
 //
 //  if(balance === 0) {
 //    await sendMessage("잔액이 부족하여 로또 구매를 종료합니다")
 //    await browser.close()
 //    return
 //  }
 //
 //  await page.goto("https://ol.dhlottery.co.kr/olotto/game/game645.do")
 //  await page.getByText("자동번호발급").click()
 //  await page.selectOption("select", String(purchaseQuantity))
 //  await page.getByRole("button", { name: "확인"}).click()
 //  await page.getByRole("button", { name: "구매하기"}).click()
 //  await page.locator("#popupLayerConfirm").getByRole("button", { name: "확인" }).click()
 //
 //  await page.locator("#report").getByRole("button", { name: "확인"}).click()
 //  const restOfBalanceStr = await page.locator("#moneyBalance").textContent()
 //  const restOfBalance = parseInt(restOfBalanceStr.replace(",",""))
 //
 //  await sendMessage(`${purchaseQuantity}개 로또 구매 완료
 // 남은 잔고는 ${restOfBalance}원`)
  await browser.close()
}

await purchaseLotto(1)