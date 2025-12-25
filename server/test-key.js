// server/test-key.js
require("dotenv").config();
const axios = require("axios");

async function testKey() {
  const key = process.env.GOOGLE_API_KEY;
  console.log(
    "Testing Key:",
    key
      ? "Key Found (starts with " + key.substring(0, 5) + "...)"
      : "❌ NO KEY FOUND"
  );

  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );

    console.log("\n✅ SUCCESS! Here are the models you can use:");
    const models = response.data.models;
    models.forEach((m) => {
      // Filter for models that support "generateContent"
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name.replace("models/", "")}`);
      }
    });
  } catch (error) {
    console.error("\n❌ FAILURE:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Reason:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testKey();
