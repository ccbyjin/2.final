// 處理第一次運算(起始帳號, 分行別, 科目別)
function getFirstVal(startingAccount, branch, subject) {
  // 處理a條件
  // 科目為20或分行代碼為001-007 且科目30、40、66以6位作檢核
  // 左邊數字補0 → "00000D6D7D8D9D10D11"。
  if (
    subject === 20 ||
    (branch >= 1 && branch <= 7 && [30, 40, 66].includes(subject))
  )
    return startingAccount.slice(5).padStart(11, "0");
  return startingAccount;
}

// 處理權重函數，取得檢核碼
function getCheckCode(accountNumber) {
  // 權重
  const weight = [5, 4, 3, 2, 8, 7, 6, 5, 4, 3, 2];

  // 乘積
  let product = 0;
  for (let i = 0; i < 11; i++) {
    product += accountNumber[i] * weight[i];
  }

  const remainder = product % 11;

  if (remainder === 0) return 1;
  if (remainder === 1) return 0;
  return 11 - remainder;
}

export { getFirstVal, getCheckCode };