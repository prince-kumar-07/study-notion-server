function paymentSuccess(orderId, paymentId, amount, name, email) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Payment Successful</title>

<style>

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
  background:linear-gradient(135deg,#6366f1,#4f46e5);
  padding:35px 20px;
  text-align:center;
}

.logo{
  font-size:22px;
  font-weight:700;
  color:white;
}

.success{
  margin-top:8px;
  font-size:14px;
  color:#e0e7ff;
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
  padding:20px;
  background:#020617;
}

.row{
  display:flex;
  justify-content:space-between;
  padding:12px 0;
  border-bottom:1px solid #1e293b;
  font-size:14px;
}

.row:last-child{
  border-bottom:none;
}

.label{
  color:#94a3b8;
  margin-right:15px;
}

.value{
  font-weight:500;
  color:#f1f5f9;
  word-break:break-all;
}

.amount{
  font-size:18px;
  font-weight:600;
  color:#a78bfa;
}

.button-area{
  text-align:center;
  margin-top:30px;
}

.button{
  display:inline-block;
  background:#6366f1;
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


/* MOBILE RESPONSIVE FIX */
@media screen and (max-width:600px){

  .container{
    width:90%;
    margin:20px auto;
  }

  .content{
    padding:20px;
  }

  .row{
    flex-direction:column;
    align-items:flex-start;
    gap:6px;
  }

}

</style>
</head>


<body>

<div class="container">

<div class="header">
<div class="logo">StudyNotion</div>
<div class="success">Payment Successful</div>
</div>

<div class="content">

<p class="message">
Hi <strong>${name}</strong>, <br><br>
Your payment was processed successfully and your enrollment on 
<strong>StudyNotion</strong> is confirmed.
</p>


<div class="receipt">

<div class="row">
<span class="label">Order ID :</span>
<span class="value">${orderId}</span>
</div>

<div class="row">
<span class="label">Payment ID :</span>
<span class="value">${paymentId}</span>
</div>

<div class="row">
<span class="label">Account Email :</span>
<span class="value">${email}</span>
</div>

<div class="row">
<span class="label">Amount Paid :</span>
<span class="amount">₹ ${amount}</span>
</div>

</div>


<div class="button-area">
<a href="https://studynotion.com/dashboard" class="button">
Go to Dashboard
</a>
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

module.exports = paymentSuccess;