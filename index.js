import { chromium } from 'playwright';
import "dotenv/config"

import { sendMessage } from './slackClient.js';

/**
 * @param {number} purchaseQuantity - 로또 구매 수량
 */
async function purchaseLotto(purchaseQuantity) {
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()
    await page.goto("https://dhlottery.co.kr/user.do?method=login")
    await page.getByPlaceholder("아이디").fill(process.env.ID)
    await page.getByPlaceholder("비밀번호").fill(process.env.PASSWORD)
    await page.getByRole("group").getByRole("link", {name: "로그인"}).click()

    const balanceElement = await page.getByRole("link", {name: /\d,000원/}).textContent()
    const balance = parseInt(balanceElement.replace(",",""))
    console.log(balance)
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

    // local에서는 문제가 없었으나 github actions 에서는 계속해서 timeour 발생하여 주석처리
    // timeout 시간을 늘려도 해결되지 않았음

     await page.goto("https://ol.dhlottery.co.kr/olotto/game/game645.do")
     await page.getByRole("link", {name: "자동번호발급"}).click()
     await page.selectOption("select", String(purchaseQuantity))
     await page.getByRole("button", { name: "확인"}).click()
     await page.getByRole("button", { name: "구매하기"}).click()


     // await page.locator("#popupLayerConfirm").getByRole("button", { name: "확인" }).click()
     //
     // await page.locator("#report").getByRole("button", { name: "확인"}).click()

     // await sendMessage(`${purchaseQuantity}개 로또 구매 완료`)
  } catch (err) {
    console.error(err.message)
    await sendMessage(`Error: ${err.message}`)
  } finally {
    await browser.close()
  }
}

await purchaseLotto(1)

