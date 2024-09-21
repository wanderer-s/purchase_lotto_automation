import { chromium } from 'playwright';
import 'dotenv/config'
import UserAgent from 'user-agents';

import { sendMessage } from './slackClient.js';

const LOTTERY_LOGIN_URL = 'https://dhlottery.co.kr/user.do?method=login'
const LOTTO_PURCHASE_URL = 'https://ol.dhlottery.co.kr/olotto/game/game645.do'

/**
 * @param {number} purchaseQuantity - 로또 구매 수량
 */
const purchaseLotto = async (purchaseQuantity) => {
  const browser = await chromium.launch()
  const userAgent = new UserAgent({ deviceCategory: 'desktop' })

  try {
    const context = await browser.newContext({
      userAgent: userAgent.toString()
    })

    const page = await context.newPage()

    await page.goto(LOTTERY_LOGIN_URL, {
      waitUntil: 'domcontentloaded'
    })

    await page.getByPlaceholder("아이디").fill(process.env.ID)
    await page.getByPlaceholder("비밀번호").fill(process.env.PASSWORD)
    await page.getByRole("group").getByRole("link", {name: "로그인"}).click({timeout: 1000})
    console.log('login success')

    // const moneyText = await page.textContent('li.money')
    // const balanceText = moneyText.replace(/[예치금충전출]/g,'').trim()
    // const balance = parseInt(balanceText.replace(",",""))
    //
    // console.log(balance)
    //
    // if (balance > 5000) {
    //   await sendMessage('잔액이 5000보다 많아요')
    //   return
    // }
    //
    // if(balance === 1000) {
    //   await sendMessage("잔액을 충전하지 않으면 다음 회차부터 구매할 수 없습니다")
    // }
    //
    // if(balance === 0) {
    //   await sendMessage("잔액이 부족하여 로또 구매를 종료합니다")
    //   await browser.close()
    // }

    await page.goto(LOTTO_PURCHASE_URL, { waitUntil:'domcontentloaded', timeout: 5000})
    console.log('init to lotto purchase page')

    await page.getByRole("link", {name: "자동번호발급"}).click()
    await page.selectOption("select", String(purchaseQuantity))
    await page.getByRole("button", { name: "확인"}).click()
    await page.getByRole("button", { name: "구매하기"}).click()

    await page.locator("#popupLayerConfirm").getByRole("button", { name: "확인" }).click()

    await page.locator("#report").getByRole("button", { name: "확인"}).click()
    await sendMessage(`${purchaseQuantity}개 로또 구매 완료.`)
  } catch (err) {
    console.error(err.message)
    await sendMessage(`Error: ${err.message}`)
  } finally {
    await browser.close()
  }
}

await purchaseLotto(1)

