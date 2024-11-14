export default function registrationTemplate(verificationLink: string) {
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Message from ASNARO</title>
  <style>
    /* Add your styles here */
  </style>
</head>
<body>
  This is your verification link : ${verificationLink}
</body>
</html>
`;

  return emailHtml;
}
