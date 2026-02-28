function paymentFailed(description, paymentId, orderId, amount, name, email) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Payment Failed</title>
<style>
  /* Base */
  body{
    margin:0;
    padding:0;
    background:#0f172a;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  }

  .container{
    max-width:620px;
    margin:40px auto;
    background:#020617;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 10px 25px rgba(0,0,0,0.4);
    color:#e5e7eb;
  }

  .header{
    background:#ef4444;
    padding:35px 20px;
    text-align:center;
  }

  .logo{
    font-size:22px;
    font-weight:700;
    color:white;
  }

  .failed{
    margin-top:8px;
    font-size:14px;
    color:#fecaca;
  }

  .content{
    padding:30px;
  }

  .message{
    font-size:15px;
    line-height:1.6;
    color:#cbd5f5;
  }

  .receipt{
    margin-top:25px;
    border:1px solid #334155;
    border-radius:10px;
    padding:4px;         /* small padding, rows have inner padding */
    background:#020617;
    overflow:hidden;
  }

  /* Row as two columns using grid — keeps row-wise layout even on small screens */
  .row{
    display:grid;
    grid-template-columns: 36% 64%; /* label / value */
    gap:12px;
    align-items:center;
    padding:12px 18px;
    border-bottom:1px solid #1e293b;
    font-size:14px;
  }

  .row:last-child{
    border-bottom:none;
  }

  .label{
    color:#94a3b8;
    font-size:13px;
  }

  .value{
    font-weight:500;
    color:#f1f5f9;
    word-break:break-word;     /* wrap long ids/emails */
    hyphens:auto;
    white-space:normal;
  }

  .amount{
    font-size:18px;
    font-weight:600;
    color:#f87171;
  }

  .button-area{
    text-align:center;
    margin:30px 0 24px;
  }

  .button{
    display:inline-block;
    background:#ef4444;
    color:white;
    padding:12px 28px;
    border-radius:8px;
    text-decoration:none;
    font-size:14px;
  }

  .footer{
    text-align:center;
    padding:25px;
    font-size:13px;
    color:#64748b;
    border-top:1px solid #1e293b;
  }

  /* Small tweaks for very narrow screens:
     keep grid but make label smaller and value wider */
  @media screen and (max-width:420px){
    .row{
      grid-template-columns: 30% 70%;
      gap:10px;
      padding:10px 14px;
    }
    .container{
      width:94%;
      margin:18px auto;
    }
    .content{
      padding:18px;
    }
    .label{ font-size:12px; }
    .value{ font-size:14px; }
  }

  /* If you prefer an absolute fallback for very old clients, display:block */
  @media screen and (max-width:320px){
    .row{
      grid-template-columns: 1fr 1fr;
    }
  }

</style>
</head>
<body>

<div class="container">

  <div class="header">
    <div class="logo">StudyNotion</div>
    <div class="failed">Payment Failed</div>
  </div>

  <div class="content">

    <p class="message">
      Hi <strong>${name}</strong>,<br><br>
      Unfortunately your payment could not be completed on <strong>StudyNotion</strong>.
      You can try the payment again from your dashboard.
    </p>

    <div class="receipt">

      <div class="row">
        <div class="label">Failure Reason :</div>
        <div class="value">${description}</div>
      </div>

      <div class="row">
        <div class="label">Order ID :</div>
        <div class="value">${orderId}</div>
      </div>

      <div class="row">
        <div class="label">Payment ID :</div>
        <div class="value">${paymentId}</div>
      </div>

      <div class="row">
        <div class="label">Amount :</div>
        <div class="value amount">₹ ${amount}</div>
      </div>

      <div class="row">
        <div class="label">Account Email :</div>
        <div class="value">${email}</div>
      </div>

    </div>

    <div class="button-area">
      <a href="https://studynotion.com/dashboard" class="button">Try Payment Again</a>
    </div>

  </div>

  <div class="footer">
    © 2026 StudyNotion • Learn Without Limits
  </div>

</div>

</body>
</html>
`;
}

module.exports = paymentFailed;