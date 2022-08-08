import fs from "fs";
import path from "path";
import https from "https";
import fetch from "node-fetch";

const ROOT_PATH = process.cwd();
const testConfig = {
  payeeAlias: "1231181189",
  currency: "SEK",
  callbackUrl: "https://localhost:3000/payment-status",
  host: "https://mss.cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: path.resolve(
    ROOT_PATH,
    "ssl/Swish_Merchant_TestCertificate_1234679304.pem"
  ),
  key: path.resolve(
    ROOT_PATH,
    "ssl/Swish_Merchant_TestCertificate_1234679304.key"
  ),
  ca: path.resolve(ROOT_PATH, "ssl/Swish_TLS_RootCA.pem"),
  passphrase: "swish",
};
const prodConfig = {
  payeeAlias: process.env.SWISH_PAYEE_ALIAS || "",
  currency: "SEK",
  callbackUrl: "https://localhost:3000/payment-status",
  host: "https://cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: path.resolve(ROOT_PATH, "ssl/prod.pem"),
  key: path.resolve(ROOT_PATH, "ssl/prod.key"),
  passphrase: process.env.SWISH_SSL_PASSPHRASE === "null" ? null : process.env.SWISH_SSL_PASSPHRASE
};
console.log("> App run on ", process.env.NODE_ENV, " mode.");
export const config =
  process.env.NODE_ENV === "development" ? testConfig : prodConfig;

const agent = new https.Agent({
  cert: `${fs.readFileSync(config.cert, { encoding: "utf8" })}`, // public key
  key: fs.readFileSync(config.key, { encoding: "utf8" }), // private key
  ca: config.ca ? fs.readFileSync(config.ca, { encoding: "utf8" }) : null, // rooot cirtificate optional
  passphrase: config.passphrase,
});

export const getPaymentDetails = async (location) => {
  return await fetch(location, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    agent,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log("> ERROR[getPaymentDetails]: ", error.message);
      return { errorMessage: error.message };
    });
};

export const createPayment = async (data) => {
  const response = await fetch(`${config.host}/api/v1/paymentrequests`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    agent,
  }).catch((error) => {
    console.log("> ERROR[createPayment]: ", error.message);
    return { errorMessage: error.message };
  });

  if (response.status === 201) {
    const paymentLink = response.headers.get("location") || response.headers["location"];
    const token = response.headers.get("paymentrequesttoken") || response.headers["paymentrequesttoken"]
    const result = await getPaymentDetails(paymentLink);
    return {
      token,
      ...result
    }
  }

  // Error handling known & unknown
  let errorMessage = "Something wrong please try again";
  try {
    // Known error
    const err = await response.json();
    return err[0] || { errorMessage };
  } catch (error) {
    // Unknown error
    errorMessage = error.message;
  }

  return { errorMessage };
};

export const getQrCode = async (
  token,
  { size = "300", format = "png", border = "0" } = {}
) => {
  const data = { token, size, format, border };
  return await fetch(`${config.qrHost}/api/v1/commerce`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    agent,
  }).catch((error) => {
    console.log("> ERROR[getQrCode]: ", error.message);
    return { errorMessage: error.message };
  });
};
